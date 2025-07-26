import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

interface ReviewFreelancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => Promise<void>;
  freelancerAddress: string;
  jobTitle: string;
  isSubmitting?: boolean;
}

export const ReviewFreelancerModal: React.FC<ReviewFreelancerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  freelancerAddress,
  jobTitle,
  isSubmitting = false
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }
    if (review.trim().length < 10) {
      alert('Please provide a review of at least 10 characters');
      return;
    }

    try {
      await onSubmit(rating, review.trim());
      onClose();
      // Reset form
      setRating(0);
      setReview('');
    } catch (error) {
      console.error('Review submission failed:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setRating(0);
      setReview('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Review Freelancer</h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Job Info */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-2">Job: {jobTitle}</h4>
          <p className="text-sm text-gray-400">
            Freelancer: {freelancerAddress.slice(0, 6)}...{freelancerAddress.slice(-4)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Rating <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-3xl transition-colors focus:outline-none"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-400">
                {rating > 0 && (
                  <>
                    {rating} star{rating !== 1 ? 's' : ''} 
                    {rating === 1 && ' - Poor'}
                    {rating === 2 && ' - Fair'} 
                    {rating === 3 && ' - Good'}
                    {rating === 4 && ' - Very Good'}
                    {rating === 5 && ' - Excellent'}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label htmlFor="review" className="block text-sm font-medium text-gray-300 mb-2">
              Public Review <span className="text-red-400">*</span>
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={isSubmitting}
              placeholder="Share your experience working with this freelancer. This review will be public and help other clients make informed decisions."
              rows={5}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
              minLength={10}
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Minimum 10 characters</span>
              <span>{review.length}/500</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 border border-gray-700 text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || review.trim().length < 10}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewFreelancerModal;
