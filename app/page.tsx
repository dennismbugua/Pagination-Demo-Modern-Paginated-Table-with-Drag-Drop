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

  const NUM_OF_RECORDS = dataArray.length;
  const LIMIT = 5;

  const onPageChanged = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, page: number) => {
      event.preventDefault();
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const currentData = dataArray.slice(
    (currentPage - 1) * LIMIT,
    (currentPage - 1) * LIMIT + LIMIT
  );

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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Task Management
              </h1>
              <p className="text-slate-400 text-lg">
                Manage and track your tasks efficiently
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 shadow-lg">
            <span className="text-white font-semibold text-lg">
              Viewing <span className="text-blue-100">{currentData.length}</span> of{" "}
              <span className="text-blue-100">{NUM_OF_RECORDS}</span> tasks
            </span>
            <span className="text-blue-100 text-sm">
              Page {currentPage} of {Math.ceil(NUM_OF_RECORDS / LIMIT)}
            </span>
          </div>
        </section>

        {/* Table Section */}
        <section className="table-section mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full" role="table" aria-label="Tasks table">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th scope="col" className="px-6 py-4 text-center font-semibold text-sm tracking-wider w-12" title="Drag to reorder rows">
                      Drag
                    </th>
                    <th scope="col" className="px-6 py-4 text-left font-semibold text-sm tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-4 text-left font-semibold text-sm tracking-wider">
                      User ID
                    </th>
                    <th scope="col" className="px-6 py-4 text-left font-semibold text-sm tracking-wider">
                      Task Title
                    </th>
                    <th scope="col" className="px-6 py-4 text-center font-semibold text-sm tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {currentData.map((item: DataItem, index: number) => {
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
                        className={`transition-all duration-200 cursor-move ${
                          draggedItem?.id === item.id
                            ? "opacity-50 bg-blue-200 dark:bg-blue-900/40"
                            : dragOverIndex === absoluteIndex
                            ? "bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500"
                            : index % 2 === 0
                            ? "bg-slate-50 dark:bg-slate-800/50"
                            : "bg-white dark:bg-slate-800"
                        } hover:bg-blue-50 dark:hover:bg-slate-700/50`}
                      >
                        <td className="px-6 py-4">
                          <span className="text-xl text-slate-400 dark:text-slate-500 cursor-grab active:cursor-grabbing" title="Drag to reorder">
                            ☰
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                            #{item.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                            {item.userId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {item.title}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                              item.completed
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                            {item.completed ? "Completed" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pagination Section */}
        <section className="pagination-section flex justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 inline-block">
            <Paginations
              totalRecords={NUM_OF_RECORDS}
              pageLimit={LIMIT}
              pageNeighbours={2}
              onPageChanged={onPageChanged}
              currentPage={currentPage}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
