// src/components/dashboard/QuickActions.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import { Plus, CheckCircle, MessageSquare, Calendar, Users, Megaphone } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface QuickActionsProps {
  attendanceCheckedIn: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ attendanceCheckedIn }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckIn = async () => {
    try {
      await api.post('/api/attendance/check-in');
      toast.success('Checked in successfully!');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/api/attendance/check-out');
      toast.success('Checked out successfully!');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Check-out failed');
    }
  };

  const canCreateTask = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        
        <div className="space-y-3">
          {canCreateTask && (
            <Button
              variant="primary"
              className="w-full justify-center"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/tasks')}
            >
              Create Task
            </Button>
          )}

          {attendanceCheckedIn ? (
            <Button
              variant="danger"
              className="w-full justify-center"
              icon={<CheckCircle className="w-4 h-4" />}
              onClick={handleCheckOut}
            >
              Check Out
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="w-full justify-center"
              icon={<CheckCircle className="w-4 h-4" />}
              onClick={handleCheckIn}
            >
              Check In
            </Button>
          )}

          <Button
            variant="secondary"
            className="w-full justify-center"
            icon={<MessageSquare className="w-4 h-4" />}
            onClick={() => navigate('/chat')}
          >
            Open Chat
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-center"
            icon={<Calendar className="w-4 h-4" />}
            onClick={() => navigate('/attendance')}
          >
            View Attendance
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-center"
            icon={<Users className="w-4 h-4" />}
            onClick={() => navigate('/team')}
          >
            Team Directory
          </Button>
        </div>
      </div>

      {/* Announcements Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-blue-600" />
            Announcements
          </h3>
          <button
            onClick={() => navigate('/announcements')}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            View all
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <p className="text-sm text-gray-900 font-medium">Team Meeting</p>
            <p className="text-xs text-gray-600 mt-1">Tomorrow at 10:00 AM in Conference Room A</p>
          </div>
          
          <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <p className="text-sm text-gray-900 font-medium">Project Milestone</p>
            <p className="text-xs text-gray-600 mt-1">Phase 1 completed successfully! 🎉</p>
          </div>

          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
            <p className="text-sm text-gray-900 font-medium">System Maintenance</p>
            <p className="text-xs text-gray-600 mt-1">Scheduled for this weekend</p>
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">💡 Quick Tip</h3>
        <p className="text-sm text-gray-700">
          Use keyboard shortcut <kbd className="px-2 py-1 bg-white rounded text-xs font-mono border border-gray-300">Ctrl + K</kbd> to quickly search across the portal.
        </p>
      </div>
    </div>
  );
};

export default QuickActions;
