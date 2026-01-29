// src/components/shared/SkeletonLoader.tsx
import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  variant = 'text',
  width = 'w-full',
  height = 'h-4',
  className = ''
}) => {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${width} ${height} ${className}`} />
  );
};

export default SkeletonLoader;

// Usage
<div className="space-y-3">
  <SkeletonLoader variant="circular" width="w-12" height="h-12" />
  <SkeletonLoader variant="text" width="w-3/4" />
  <SkeletonLoader variant="text" width="w-1/2" />
  <SkeletonLoader variant="rectangular" width="w-full" height="h-32" />
</div>
