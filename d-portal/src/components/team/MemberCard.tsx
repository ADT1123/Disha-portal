// src/components/team/MemberCard.tsx
import React from 'react';
import Avatar from '../shared/Avatar';
import Badge from '../shared/Badge';
import { Mail, Phone, MapPin } from 'lucide-react';

// Define User interface locally
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  department?: string;
  designation?: string;
  profilePic?: string;
  status?: 'Available' | 'Busy' | 'On Leave' | 'Offline';
  phone?: string;
  joiningDate?: string;
}

interface MemberCardProps {
  member: User;
  onClick: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Busy': return 'warning';
      case 'On Leave': return 'danger';
      default: return 'neutral';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'manager': return 'info';
      default: return 'neutral';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <Avatar
          name={member.name}
          src={member.profilePic}
          size="lg"
          status={member.status === 'Available' ? 'online' : member.status === 'Busy' ? 'busy' : 'offline'}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.designation || 'Team Member'}</p>
            </div>
            <Badge variant={getRoleBadgeColor(member.role) as any} size="sm">
              {member.role}
            </Badge>
          </div>

          <div className="space-y-1 mb-3">
            {member.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{member.phone}</span>
              </div>
            )}
            {member.department && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{member.department}</span>
              </div>
            )}
          </div>

          <Badge variant={getStatusColor(member.status) as any} size="sm">
            {member.status || 'Offline'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
