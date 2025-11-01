"use client";

import React, { useState, useEffect, MouseEvent } from "react";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from: number, to: number, step: number = 1): (number | string)[] => {
  let i = from;
  const rangeArray: number[] = [];

  while (i <= to) {
    rangeArray.push(i);
    i += step;
  }

  return rangeArray;
};

interface PaginationsProps {
  totalRecords: number;
  pageLimit: number;
  pageNeighbours: number;
  onPageChanged: (event: MouseEvent<HTMLAnchorElement>, page: number) => void;
  currentPage: number;
}

const Paginations: React.FC<PaginationsProps> = ({
  totalRecords,
  pageLimit,
  pageNeighbours,
  onPageChanged,
  currentPage
}) => {
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
    setTotalPages(Math.ceil(totalRecords / pageLimit));
  }, [totalRecords, pageLimit]);

  const fetchPageNumbers = (): (number | string)[] => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

      let pages: (number | string)[] = range(startPage, endPage);

      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, totalPages];
    }
    return range(1, totalPages);
  };

  const pages = fetchPageNumbers() || [];
  
  return (
    <nav aria-label="Pagination Navigation" className="flex items-center justify-center">
      <ul className="flex items-center gap-2">
        {pages.map((page, index) => {
          if (page === LEFT_PAGE)
            return (
              <li key={index}>
                <a
                  href="/"
                  className="group relative flex items-center justify-center w-12 h-12 rounded-xl border-2 border-slate-300/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 font-bold overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:scale-110 hover:shadow-xl hover:shadow-blue-500/20"
                  aria-label="Previous page"
                  onClick={(e) => onPageChanged(e, pageNeighbours * 2 - 1)}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <svg className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </a>
              </li>
            );

          if (page === RIGHT_PAGE)
            return (
              <li key={index}>
                <a
                  className="group relative flex items-center justify-center w-12 h-12 rounded-xl border-2 border-slate-300/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 font-bold overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:scale-110 hover:shadow-xl hover:shadow-blue-500/20"
                  href="/"
                  aria-label="Next page"
                  onClick={(e) => onPageChanged(e, pageNeighbours * 2 + 3)}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <svg className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            );

          return (
            <li key={index}>
              <a
                className={`relative group flex items-center justify-center w-12 h-12 rounded-xl font-bold text-base transition-all duration-300 overflow-hidden ${
                  currentPage === page
                    ? "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-blue-500/50 scale-110 border-2 border-transparent"
                    : "border-2 border-slate-300/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10"
                }`}
                href="/"
                onClick={(e) => onPageChanged(e, typeof page === "number" ? page : 1)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {currentPage === page && (
                  <>
                    <span className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-pulse opacity-50"></span>
                    <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-md opacity-75"></span>
                  </>
                )}
                {currentPage !== page && (
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                )}
                <span className="relative z-10 group-hover:scale-110 transition-transform">{page}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Paginations;
