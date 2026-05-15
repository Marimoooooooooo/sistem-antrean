'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

export default function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-row-reverse justify-center gap-2">
      {[5, 4, 3, 2, 1].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-colors"
        >
          <Star
            className={`w-10 h-10 transition-colors ${
              star <= (hover || value)
                ? 'text-yellow-500 fill-current'
                : 'text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
