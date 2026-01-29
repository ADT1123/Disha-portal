// src/pages/Performance.tsx
import React, { useEffect, useState } from 'react';
import type { Performance as PerformanceType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner.tsx';
import Badge from '../components/shared/Badge';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle,
  Award,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Performance: React.FC = () => {
  const { user } = useAuth();
  const [performance, setPerformance] = useState<PerformanceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // "2026-01"
  );
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    fetchPerformance();
  }, [selectedMonth]);

  const fetchPerformance = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/performance?month=${selectedMonth}`);
      setPerformance(response.data.performance);
    } catch (error) {
      console.error('Failed to fetch performance:', error);
      // Set empty performance data if none exists
      setPerformance(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      await api.post(`/api/performance/${performance?._id}/notes`, {
        note: noteText
      });
      toast.success('Note added successfully!');
      setShowNoteModal(false);
      setNoteText('');
      fetchPerformance();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add note');
    }
  };

  const getPerformanceRating = (percentage: number) => {
    if (percentage >= 90) return { label: 'Excellent', color: 'text-green-600', badge: 'success' };
    if (percentage >= 75) return { label: 'Good', color: 'text-blue-600', badge: 'info' };
    if (percentage >= 60) return { label: 'Average', color: 'text-yellow-600', badge: 'warning' };
    return { label: 'Needs Improvement', color: 'text-red-600', badge: 'danger' };
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (current < previous) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const canAddNotes = user?.role === 'admin' || user?.role === 'manager';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading performance data..." />
      </div>
    );
  }

  const metrics = performance?.metrics || {
    tasksCompleted: 0,
    onTimeDeliveryPercentage: 0,
    averageCompletionTime: 0,
    totalWorkHours: 0,
  };

  const rating = getPerformanceRating(metrics.onTimeDeliveryPercentage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your work performance and achievements</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            max={new Date().toISOString().slice(0, 7)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {canAddNotes && (
            <Button
              variant="secondary"
              icon={<MessageSquare className="w-4 h-4" />}
              onClick={() => setShowNoteModal(true)}
            >
              Add Note
            </Button>
          )}
        </div>
      </div>

      {/* Performance Summary Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">Overall Performance</p>
            <h2 className="text-4xl font-bold">{rating.label}</h2>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="bg-white/20 text-white border-white/30">
            {format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}
          </Badge>
          <span className="text-blue-100 text-sm">
            {metrics.tasksCompleted} tasks completed
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tasks Completed */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(metrics.tasksCompleted, 0)}
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Tasks Completed</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{metrics.tasksCompleted}</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        {/* On-Time Delivery */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <Badge variant={rating.badge as any} size="sm">
              {rating.label}
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">On-Time Delivery</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {metrics.onTimeDeliveryPercentage.toFixed(0)}%
          </p>
          <p className="text-sm text-gray-500">
            {metrics.onTimeDeliveryPercentage >= 80 ? '🎉 Excellent!' : '📈 Keep improving'}
          </p>
        </div>

        {/* Avg Completion Time */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Completion Time</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {metrics.averageCompletionTime?.toFixed(1) || 0}
            <span className="text-lg text-gray-500 ml-1">hrs</span>
          </p>
          <p className="text-sm text-gray-500">Per task</p>
        </div>

        {/* Total Work Hours */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Work Hours</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {metrics.totalWorkHours.toFixed(0)}
            <span className="text-lg text-gray-500 ml-1">hrs</span>
          </p>
          <p className="text-sm text-gray-500">
            {((metrics.totalWorkHours / 160) * 100).toFixed(0)}% of 160h target
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Breakdown</h3>
        
        <div className="space-y-6">
          {/* Task Completion Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-sm font-medium text-gray-700">Task Completion Rate</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {metrics.tasksCompleted > 0 ? '100%' : '0%'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: metrics.tasksCompleted > 0 ? '100%' : '0%' }}
              />
            </div>
          </div>

          {/* On-Time Delivery */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                <span className="text-sm font-medium text-gray-700">On-Time Delivery</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {metrics.onTimeDeliveryPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${metrics.onTimeDeliveryPercentage}%` }}
              />
            </div>
          </div>

          {/* Work Hours Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                <span className="text-sm font-medium text-gray-700">Work Hours (Target: 160h)</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {metrics.totalWorkHours.toFixed(0)}h / 160h
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((metrics.totalWorkHours / 160) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Achievements
          </h3>
          <div className="space-y-3">
            {metrics.tasksCompleted >= 20 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl">🏆</div>
                <div>
                  <p className="font-medium text-gray-900">High Achiever</p>
                  <p className="text-sm text-gray-600">Completed {metrics.tasksCompleted} tasks</p>
                </div>
              </div>
            )}
            {metrics.onTimeDeliveryPercentage >= 90 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="text-2xl">⚡</div>
                <div>
                  <p className="font-medium text-gray-900">Punctual Pro</p>
                  <p className="text-sm text-gray-600">90%+ on-time delivery</p>
                </div>
              </div>
            )}
            {metrics.totalWorkHours >= 160 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl">💪</div>
                <div>
                  <p className="font-medium text-gray-900">Dedicated Worker</p>
                  <p className="text-sm text-gray-600">Met work hours target</p>
                </div>
              </div>
            )}
            {metrics.tasksCompleted === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Complete tasks to unlock achievements! 🎯</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips & Suggestions */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Performance Tips</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Complete tasks before deadlines to improve on-time delivery rate</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Break large tasks into smaller chunks for better time management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Maintain consistent work hours throughout the month</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Communicate with managers about blockers early</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">✓</span>
              <span>Review your performance metrics weekly to stay on track</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Manager Notes */}
      {performance?.managerNotes && performance.managerNotes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Manager Feedback
          </h3>
          <div className="space-y-4">
            {performance.managerNotes.map((note, index) => (
              <div key={index} className="border-l-4 border-blue-500 bg-blue-50 pl-4 pr-4 py-3 rounded-r-lg">
                <p className="text-sm text-gray-900 mb-2">{note.note}</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-medium">{note.managerId.name}</span>
                  <span>•</span>
                  <span>{format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!performance && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Performance Data</h3>
          <p className="text-gray-600">
            No performance data available for {format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}.
            <br />
            Start completing tasks to see your performance metrics!
          </p>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && (
        <Modal
          isOpen={showNoteModal}
          onClose={() => {
            setShowNoteModal(false);
            setNoteText('');
          }}
          title="Add Manager Note"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Performance Note
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={5}
                placeholder="Enter feedback or notes about performance..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleAddNote}
              >
                Add Note
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteText('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Performance;
