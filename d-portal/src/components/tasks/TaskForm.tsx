// src/components/tasks/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import type { User } from '../../types';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Dropdown from '../shared/Dropdown';
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface TaskFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    assignedTo: initialData?.assignedTo?._id || '',
    priority: initialData?.priority || 'Medium',
    deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().slice(0, 16) : '',
    isRecurring: initialData?.isRecurring || false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.assignedTo || !formData.deadline) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        deadline: new Date(formData.deadline).toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  const userOptions = users.map(user => ({
    label: user.name,
    value: user._id,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title *"
        value={formData.title}
        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Enter task title"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter task description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <Dropdown
        label="Assign To *"
        options={userOptions}
        value={formData.assignedTo}
        onChange={(value: any) => setFormData({ ...formData, assignedTo: value })}
        placeholder="Select team member"
      />

      <Dropdown
        label="Priority *"
        options={priorityOptions}
        value={formData.priority}
        onChange={(value: any) => setFormData({ ...formData, priority: value })}
      />

      <Input
        label="Deadline *"
        type="datetime-local"
        value={formData.deadline}
        onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, deadline: e.target.value })}
        required
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isRecurring"
          checked={formData.isRecurring}
          onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
          Make this a recurring task
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1" loading={loading}>
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
