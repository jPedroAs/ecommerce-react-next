import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface ProductRatingProps {
  productId: string;
  initialRating?: number;
  onRate?: (rating: number) => void;
}

export default function ProductRating({
  productId,
  initialRating = 0,
  onRate,
}: ProductRatingProps) {
  const [rating, setRating] = useState(initialRating);

  const handleClick = (value: number) => {
    setRating(value);
    onRate?.(value);
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`w-6 h-6 cursor-pointer transition-colors ${
            star <= rating ? "text-[#FFD700]" : "text-gray-300"
          }`}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
}
