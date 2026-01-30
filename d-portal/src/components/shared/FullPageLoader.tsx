// src/components/shared/FullPageLoader.tsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface FullPageLoaderProps {
  text?: string;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">DISHA Portal</h2>
        </div>
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};

export default FullPageLoader;
