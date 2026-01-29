// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import DashboardWidget from '../components/dashboard/DashboardWidget.tsx';
import TaskOverview from '../components/dashboard/TaskOverview.tsx';
import QuickActions from '../components/dashboard/QuickActions.tsx';
import { CheckSquare, Users, Calendar, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/shared/LoadingSpinner';

interface DashboardStats {
  tasks: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
  team: {
    total: number;
    available: number;
    onLeave: number;
  };
  attendance: {
    checkedIn: boolean;
    checkInTime?: string;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, attendanceRes] = await Promise.all([
        api.get('/api/tasks/stats/me'),
        api.get('/api/attendance/today'),
      ]);

      setStats({
        tasks: tasksRes.data.stats || {
          total: 0,
          todo: 0,
          inProgress: 0,
          completed: 0,
          overdue: 0,
        },
        team: {
          total: 12,
          available: 10,
          onLeave: 2,
        },
        attendance: {
          checkedIn: !!attendanceRes.data.attendance?.checkIn?.time,
          checkInTime: attendanceRes.data.attendance?.checkIn?.time,
        },
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set default empty stats
      setStats({
        tasks: { total: 0, todo: 0, inProgress: 0, completed: 0, overdue: 0 },
        team: { total: 0, available: 0, onLeave: 0 },
        attendance: { checkedIn: false },
      });
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.name}! 👋
            </h1>
            <p className="text-blue-100">
              Here's what's happening with your work today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-blue-100 text-sm">Today's Date</p>
              <p className="text-2xl font-bold">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardWidget
          title="Total Tasks"
          value={stats?.tasks.total || 0}
          icon={<CheckSquare className="w-5 h-5" />}
          color="blue"
          subtitle={`${stats?.tasks.overdue || 0} overdue`}
        />
        <DashboardWidget
          title="In Progress"
          value={stats?.tasks.inProgress || 0}
          icon={<Clock className="w-5 h-5" />}
          color="yellow"
          subtitle="Active tasks"
        />
        <DashboardWidget
          title="Completed"
          value={stats?.tasks.completed || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
          subtitle="This month"
        />
        <DashboardWidget
          title="Team Members"
          value={stats?.team.available || 0}
          icon={<Users className="w-5 h-5" />}
          color="purple"
          subtitle={`${stats?.team.total || 0} total`}
        />
      </div>

      {/* Overdue Tasks Alert */}
      {stats && stats.tasks.overdue > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-red-900">
                You have {stats.tasks.overdue} overdue task{stats.tasks.overdue > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-red-700 mt-1">
                Please review and complete them as soon as possible
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Overview - Takes 2 columns */}
        <div className="lg:col-span-2">
          <TaskOverview />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions attendanceCheckedIn={stats?.attendance.checkedIn || false} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">New task assigned: <span className="font-medium">Update documentation</span></p>
              <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Task completed: <span className="font-medium">Code review</span></p>
              <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">You joined team chat: <span className="font-medium">Development Team</span></p>
              <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
