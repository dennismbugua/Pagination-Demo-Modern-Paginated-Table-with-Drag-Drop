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
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 font-semibold"
                  aria-label="Previous page"
                  onClick={(e) => onPageChanged(e, pageNeighbours * 2 - 1)}
                >
                  <span aria-hidden="true" className="text-lg">&laquo;</span>
                </a>
              </li>
            );

          if (page === RIGHT_PAGE)
            return (
              <li key={index}>
                <a
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 font-semibold"
                  href="/"
                  aria-label="Next page"
                  onClick={(e) => onPageChanged(e, pageNeighbours * 2 + 3)}
                >
                  <span aria-hidden="true" className="text-lg">&raquo;</span>
                </a>
              </li>
            );

          return (
            <li key={index}>
              <a
                className={`flex items-center justify-center w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400"
                }`}
                href="/"
                onClick={(e) => onPageChanged(e, typeof page === "number" ? page : 1)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Paginations;
