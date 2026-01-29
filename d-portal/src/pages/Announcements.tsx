// src/pages/Announcements.tsx
import React, { useEffect, useState } from 'react';
import type { Announcement } from '../types';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Button from '../components/shared/Button.tsx';
import Modal from '../components/shared/Modal.tsx';
import Badge from '../components/shared/Badge.tsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.tsx';
import { Plus, Pin, Megaphone, AlertCircle } from 'lucide-react';
import { formatDate, getRelativeTime } from '../utils/dateHelpers';
import toast from 'react-hot-toast';

const Announcements: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'company-wide' as 'company-wide' | 'team-specific' | 'department',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    isPinned: false,
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/api/announcements');
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/announcements', formData);
      toast.success('Announcement created!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        content: '',
        type: 'company-wide',
        priority: 'Medium',
        isPinned: false,
      });
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create announcement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await api.delete(`/api/announcements/${id}`);
      toast.success('Announcement deleted!');
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete announcement');
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'Medium':
        return <Megaphone className="w-5 h-5 text-yellow-600" />;
      default:
        return <Megaphone className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      default: return 'info';
    }
  };

  const canCreateAnnouncement = user?.role === 'admin' || user?.role === 'manager';

  const pinnedAnnouncements = announcements.filter(a => a.isPinned);
  const regularAnnouncements = announcements.filter(a => !a.isPinned);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading announcements..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Company and team updates</p>
        </div>
        {canCreateAnnouncement && (
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            New Announcement
          </Button>
        )}
      </div>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Pin className="w-4 h-4" />
            Pinned Announcements
          </h2>
          {pinnedAnnouncements.map(announcement => (
            <div
              key={announcement._id}
              className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getPriorityIcon(announcement.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {announcement.title}
                      </h3>
                      <Badge variant={getPriorityColor(announcement.priority) as any} size="sm">
                        {announcement.priority}
                      </Badge>
                      <Badge variant="info" size="sm">
                        {announcement.type}
                      </Badge>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                  </div>
                </div>
                {canCreateAnnouncement && announcement.createdBy._id === user?._id && (
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>By {announcement.createdBy.name}</span>
                <span>•</span>
                <span>{getRelativeTime(announcement.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regular Announcements */}
      <div className="space-y-3">
        {pinnedAnnouncements.length > 0 && (
          <h2 className="text-sm font-semibold text-gray-700">All Announcements</h2>
        )}
        {regularAnnouncements.length === 0 && pinnedAnnouncements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No announcements yet</p>
          </div>
        ) : (
          regularAnnouncements.map(announcement => (
            <div
              key={announcement._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getPriorityIcon(announcement.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {announcement.title}
                      </h3>
                      <Badge variant={getPriorityColor(announcement.priority) as any} size="sm">
                        {announcement.priority}
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        {announcement.type}
                      </Badge>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                  </div>
                </div>
                {canCreateAnnouncement && announcement.createdBy._id === user?._id && (
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>By {announcement.createdBy.name}</span>
                <span>•</span>
                <span>{getRelativeTime(announcement.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Announcement"
          size="lg"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="company-wide">Company-wide</option>
                  <option value="team-specific">Team-specific</option>
                  <option value="department">Department</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPinned"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="isPinned" className="text-sm font-medium text-gray-700">
                Pin this announcement
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                Create Announcement
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Announcements;
