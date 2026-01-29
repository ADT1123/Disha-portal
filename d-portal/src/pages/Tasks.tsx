// src/pages/Tasks.tsx
import React, { useEffect, useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import api from '../utils/api';
import type { Task } from '../types';
import Button from '../components/shared/Button.tsx';
import Modal from '../components/shared/Modal';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await api.get(`/api/tasks?${params.toString()}`);
      let taskList = response.data.tasks || [];

      if (filters.search) {
        taskList = taskList.filter((task: Task) =>
          task.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setTasks(taskList);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      await api.post('/api/tasks', taskData);
      toast.success('Task created successfully!');
      setShowCreateModal(false);
      fetchTasks();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      await api.put(`/api/tasks/${taskId}`, updates);
      toast.success('Task updated successfully!');
      fetchTasks();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/api/tasks/${taskId}`);
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete task');
    }
  };

  const groupedTasks = {
    'To Do': tasks.filter(t => t.status === 'To Do'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Completed': tasks.filter(t => t.status === 'Completed'),
  };

  const canCreateTask = user?.role === 'admin' || user?.role === 'manager';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading tasks..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track your tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          {canCreateTask && (
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreateModal(true)}
            >
              New Task
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <TaskFilters
          filters={filters}
          onFilterChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedTasks).map(([status, taskList]) => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{status}</h3>
              <span className="text-sm text-gray-500">{taskList.length}</span>
            </div>
            <div className="space-y-3">
              {taskList.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
              {taskList.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">
                  No tasks
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Task"
          size="lg"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Tasks;
