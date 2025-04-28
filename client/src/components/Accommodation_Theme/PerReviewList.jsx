import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PerReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <div className="py-4 text-center text-gray-500">작성된 리뷰가 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                <span className="text-sm text-gray-600">{review.author[0]}</span>
              </div>
              <div>
                <div className="text-sm font-semibold">{review.author}</div>
                <div className="text-xs text-gray-500">{review.date}</div>
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-700">{review.content}</p>
          
          {/* 리뷰 이미지가 있는 경우 표시 */}
          {review.images && review.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:9000/${image}`}
                  alt={`리뷰 이미지 ${index + 1}`}
                  className="max-w-[200px] w-full max-h-[150px] h-full rounded object-contain"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
