"use client";

import React, { useState, useCallback, MouseEvent } from "react";
import data from "@/data/data.json";
import Paginations from "@/components/Pagination";

interface DataItem {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataArray, setDataArray] = useState<DataItem[]>(Array.isArray(data) ? data : []);
  const [draggedItem, setDraggedItem] = useState<DataItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [userIdFilter, setUserIdFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const LIMIT = 5;

  // Apply filters to data
  const filteredData = dataArray.filter((item) => {
    // Status filter
    if (statusFilter === "completed" && !item.completed) return false;
    if (statusFilter === "pending" && item.completed) return false;

    // User ID filter
    if (userIdFilter && item.userId.toString() !== userIdFilter) return false;

    // Search query filter (title)
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true;
  });

  const NUM_OF_RECORDS = filteredData.length;

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const onPageChanged = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, page: number) => {
      event.preventDefault();
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const currentData = filteredData.slice(
    (currentPage - 1) * LIMIT,
    (currentPage - 1) * LIMIT + LIMIT
  );

  // Get unique user IDs for filter dropdown
  const uniqueUserIds = Array.from(new Set(dataArray.map(item => item.userId))).sort((a, b) => a - b);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    setUserIdFilter("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const activeFiltersCount = 
    (statusFilter !== "all" ? 1 : 0) +
    (userIdFilter !== "" ? 1 : 0) +
    (searchQuery !== "" ? 1 : 0);

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, item: DataItem) => {
    setDraggedItem(item);
    e.dataTransfer!.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetItem: DataItem) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = dataArray.findIndex((item) => item.id === draggedItem.id);
    const targetIndex = dataArray.findIndex((item) => item.id === targetItem.id);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newData = [...dataArray];
      newData.splice(draggedIndex, 1);
      newData.splice(targetIndex, 0, draggedItem);
      setDataArray(newData);
    }

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 p-6 md:p-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section with enhanced styling */}
        <section className="mb-12 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                  Task Management
                </h1>
              </div>
              <p className="text-slate-300 text-lg md:text-xl font-light ml-15">
                Organize, prioritize, and conquer your workflow
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="relative px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/10"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-6 animate-slide-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      Filter Options
                    </h3>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Status
                      </label>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => { setStatusFilter("all"); handleFilterChange(); }}
                          className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                            statusFilter === "all"
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : "bg-slate-200/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50"
                          }`}
                        >
                          All Tasks
                        </button>
                        <button
                          onClick={() => { setStatusFilter("completed"); handleFilterChange(); }}
                          className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                            statusFilter === "completed"
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                              : "bg-slate-200/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </button>
                        <button
                          onClick={() => { setStatusFilter("pending"); handleFilterChange(); }}
                          className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                            statusFilter === "pending"
                              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                              : "bg-slate-200/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pending
                        </button>
                      </div>
                    </div>

                    {/* User ID Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        User ID
                      </label>
                      <select
                        value={userIdFilter}
                        onChange={(e) => { setUserIdFilter(e.target.value); handleFilterChange(); }}
                        className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      >
                        <option value="">All Users</option>
                        {uniqueUserIds.map((userId) => (
                          <option key={userId} value={userId}>
                            User {userId}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Search Tasks
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
                          placeholder="Search by title..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => { setSearchQuery(""); handleFilterChange(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Active filters summary */}
                  {activeFiltersCount > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-300 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">Active filters:</span>
                        {statusFilter !== "all" && (
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full font-medium">
                            {statusFilter}
                          </span>
                        )}
                        {userIdFilter && (
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full font-medium">
                            User {userIdFilter}
                          </span>
                        )}
                        {searchQuery && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full font-medium">
                            "{searchQuery}"
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75"></div>
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-white/80 text-sm font-medium block">
                    {activeFiltersCount > 0 ? "Filtered Tasks" : "Total Tasks"}
                  </span>
                  <span className="text-white font-bold text-2xl">
                    Viewing <span className="text-blue-200">{currentData.length}</span> of{" "}
                    <span className="text-blue-200">{NUM_OF_RECORDS}</span>
                    {activeFiltersCount > 0 && (
                      <span className="text-sm text-blue-200 ml-2">
                        (from {dataArray.length} total)
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                {activeFiltersCount > 0 && (
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/20 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="text-blue-100 text-sm font-medium">
                      {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                    </span>
                  </div>
                )}
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                  <span className="text-blue-100 text-sm font-medium">
                    Page {currentPage} of {Math.ceil(NUM_OF_RECORDS / LIMIT) || 1}
                  </span>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-white/90 text-sm font-medium">Live</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table Section with enhanced glassmorphism */}
        <section className="mb-10 animate-slide-up">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700/50">
              {/* Table header decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
              
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="Tasks table">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white">
                      <th scope="col" className="px-6 py-5 text-center font-bold text-sm tracking-wider w-12 group-hover:scale-105 transition-transform" title="Drag to reorder rows">
                        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                      </th>
                      <th scope="col" className="px-6 py-5 text-left font-bold text-sm tracking-wider uppercase">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          ID
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-5 text-left font-bold text-sm tracking-wider uppercase">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          User
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-5 text-left font-bold text-sm tracking-wider uppercase">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Task Title
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-5 text-center font-bold text-sm tracking-wider uppercase">
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Status
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                              No tasks found
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">
                              {activeFiltersCount > 0 
                                ? "Try adjusting your filters to see more results" 
                                : "No tasks available at the moment"}
                            </p>
                            {activeFiltersCount > 0 && (
                              <button
                                onClick={clearFilters}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                              >
                                Clear Filters
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item: DataItem, index: number) => {
                    const absoluteIndex = (currentPage - 1) * LIMIT + index;
                    return (
                      <tr
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => handleDragEnter(e, absoluteIndex)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, item)}
                        onDragEnd={handleDragEnd}
                        className={`group transition-all duration-300 cursor-move ${
                          draggedItem?.id === item.id
                            ? "opacity-40 scale-95 bg-blue-200/60 dark:bg-blue-900/40 shadow-xl"
                            : dragOverIndex === absoluteIndex
                            ? "bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/40 dark:to-purple-900/40 border-l-4 border-blue-500 shadow-lg scale-[1.02]"
                            : index % 2 === 0
                            ? "bg-slate-50/80 dark:bg-slate-800/50 hover:bg-blue-50/80 dark:hover:bg-slate-700/60"
                            : "bg-white/80 dark:bg-slate-800/30 hover:bg-blue-50/80 dark:hover:bg-slate-700/60"
                        } hover:shadow-lg hover:scale-[1.01]`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center">
                            <span className="text-2xl text-slate-400 dark:text-slate-500 cursor-grab active:cursor-grabbing group-hover:text-blue-500 group-hover:scale-110 transition-all duration-200" title="Drag to reorder">
                              ⋮⋮
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
                                {item.id}
                              </span>
                            </div>
                            <span className="font-mono text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              #{item.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                              <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                                {item.userId}
                              </span>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">User ID</div>
                              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.userId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <span className="text-slate-800 dark:text-slate-200 font-semibold text-base leading-relaxed group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {item.title}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-500 dark:text-slate-400">Task #{item.id}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">User {item.userId}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center">
                            {item.completed ? (
                              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 group-hover:shadow-xl group-hover:shadow-green-500/50 group-hover:scale-105">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 group-hover:shadow-xl group-hover:shadow-amber-500/50 group-hover:scale-105">
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pending
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </section>

        {/* Pagination Section with glassmorphism */}
        {NUM_OF_RECORDS > 0 && (
          <section className="flex justify-center animate-fade-in-up">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-slate-700/50">
                <Paginations
                  totalRecords={NUM_OF_RECORDS}
                  pageLimit={LIMIT}
                  pageNeighbours={2}
                  onPageChanged={onPageChanged}
                  currentPage={currentPage}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
