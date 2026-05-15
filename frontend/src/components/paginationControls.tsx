// components/PaginationControls.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (direction: 'next' | 'prev') => {
    const nextPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', nextPage.toString());

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between px-2">
      <button
        onClick={() => handlePageChange('prev')}
        disabled={currentPage <= 1}
        className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <p className="text-sm text-gray-600">
        Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalPages}</span>
      </p>
      <button
        onClick={() => handlePageChange('next')}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
