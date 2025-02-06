'use client';

import { Review } from '@/lib/types';

interface ReviewExportProps {
  reviews: Review[];
}

export default function ReviewExport({ reviews }: ReviewExportProps) {
  const exportToCSV = () => {
    const headers = ['Date', 'Author', 'Rating', 'Source', 'Content'];
    const csvContent = [
      headers.join(','),
      ...reviews.map(review => [
        new Date(review.date).toLocaleDateString(),
        `"${review.author}"`,
        review.rating,
        review.source,
        `"${review.content.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reviews_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <button
      onClick={exportToCSV}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
    >
      Export Reviews
    </button>
  );
}