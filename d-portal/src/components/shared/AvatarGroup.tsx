// src/components/shared/AvatarGroup.tsx
import React from 'react';
import Avatar from './Avatar';
import { User } from '../../types';

interface AvatarGroupProps {
  users: User[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ 
  users, 
  max = 4,
  size = 'md'
}) => {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  const spacing = {
    sm: '-ml-2',
    md: '-ml-3',
    lg: '-ml-4'
  };

  return (
    <div className="flex items-center">
      {displayUsers.map((user, index) => (
        <div 
          key={user._id} 
          className={`${index > 0 ? spacing[size] : ''}`}
          style={{ zIndex: displayUsers.length - index }}
        >
          <Avatar 
            name={user.name} 
            src={user.profilePic}
            size={size}
            status={user.status === 'Available' ? 'online' : 'offline'}
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className={`${spacing[size]} ${
          size === 'sm' ? 'w-8 h-8 text-xs' :
          size === 'md' ? 'w-10 h-10 text-sm' :
          'w-12 h-12 text-base'
        } rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold border-2 border-white`}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
