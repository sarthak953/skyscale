'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
  users: { first_name: string; last_name: string } | null;
}

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews?productId=${productId}`);
    const data = await res.json();
    setReviews(data);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, rating, title, comment })
    });
    if (res.ok) {
      setShowForm(false);
      setTitle('');
      setComment('');
      setRating(5);
      fetchReviews();
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
        >
          Write a Review
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitReview} className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="mb-4">
            <label className="block font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-3xl"
                >
                  {star <= rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-yellow-500">
                {'⭐'.repeat(review.rating)}
              </div>
              {review.is_verified_purchase && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Verified Purchase
                </span>
              )}
            </div>
            <h3 className="font-semibold mb-1">{review.title}</h3>
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <div className="text-sm text-gray-500">
              By {review.users?.first_name || 'Anonymous'} on{' '}
              {new Date(review.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
