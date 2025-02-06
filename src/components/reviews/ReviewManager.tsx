"use client";

import { useState, useEffect } from "react";
import { Review } from "@/lib/types";
import ReviewFilter from "./ReviewFilter";
import ReviewList from "./ReviewList";
import ReviewPagination from "./ReviewPagination";
import ReviewExport from "./ReviewExport";
const ITEMS_PER_PAGE = 10;

interface ReviewsManagerProps {
  reviews: Review[];
}

export default function ReviewsManager({ reviews }: ReviewsManagerProps) {
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredReviews.length]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/reviews/stream?widgetId=${widgetId}`);
    
    eventSource.onmessage = (event) => {
      const newReviews = JSON.parse(event.data);
      setFilteredReviews(newReviews);
    };
  
    return () => eventSource.close();
  }, [widgetId]);

  return (
    <div className="space-y-6">
      <ReviewFilter reviews={reviews} onFilter={setFilteredReviews} />

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Reviews ({filteredReviews.length})
          </h2>
          <div className="flex gap-4 items-center">
            <ReviewExport reviews={filteredReviews} />
            <select
              className="rounded-md border-gray-300"
              onChange={(e) => setCurrentPage(1)}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>

        <ReviewList reviews={paginatedReviews} showSource={true} />

        <ReviewPagination
          total={filteredReviews.length}
          perPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
