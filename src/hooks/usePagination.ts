import { useMemo, useState } from "react";

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

interface UsePaginationResult<T> {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  currentData: T[];
}

export const usePagination = <T>({
  data,
  itemsPerPage,
}: UsePaginationProps<T>): UsePaginationResult<T> => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [currentPage, data, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentData,
  };
};
