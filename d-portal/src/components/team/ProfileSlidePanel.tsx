// src/components/team/ProfileSlidePanel.tsx
import React from 'react';
import type { User } from '../../types';
import Avatar from '../shared/Avatar';
import Badge from '../shared/Badge.tsx';
import Button from '../shared/Button.tsx';
import { X, Mail, Phone, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateHelpers';

interface ProfileSlidePanelProps {
  member: User;
  onClose: () => void;
}

const ProfileSlidePanel: React.FC<ProfileSlidePanelProps> = ({ member, onClose }) => {
  const navigate = useNavigate();

  const handleStartChat = async () => {
    // Navigate to chat and create conversation
    navigate('/chat');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar & Basic Info */}
          <div className="text-center">
            <Avatar
              name={member.name}
              src={member.profilePic}
              size="xl"
              status={member.status === 'Available' ? 'online' : 'offline'}
            />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">{member.name}</h3>
            <p className="text-gray-600">{member.designation || 'Team Member'}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant={member.role === 'admin' ? 'danger' : member.role === 'manager' ? 'info' : 'neutral'}>
                {member.role}
              </Badge>
              <Badge variant={member.status === 'Available' ? 'success' : 'neutral'}>
                {member.status || 'Offline'}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1"
              icon={<MessageSquare className="w-4 h-4" />}
              onClick={handleStartChat}
            >
              Message
            </Button>
            <Button
              variant="secondary"
              icon={<Mail className="w-4 h-4" />}
              onClick={() => window.location.href = `mailto:${member.email}`}
            >
              Email
            </Button>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Contact Information</h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900 truncate">{member.email}</p>
                </div>
              </div>

              {member.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{member.phone}</p>
                  </div>
                </div>
              )}

              {member.department && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{member.department}</p>
                  </div>
                </div>
              )}

              {member.joiningDate && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(member.joiningDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">About</h4>
            <p className="text-sm text-gray-600">
              {member.designation || 'Team Member'} in {member.department || 'the team'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSlidePanel;
