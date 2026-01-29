// src/components/tasks/TaskFilters.tsx
import React from 'react';
import { X, Search } from 'lucide-react';
import Dropdown from '../shared/Dropdown';
import Input from '../shared/Input';

interface TaskFiltersProps {
  filters: {
    status: string;
    priority: string;
    search: string;
  };
  onFilterChange: (filters: any) => void;
  onClose: () => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onFilterChange, onClose }) => {
  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'To Do', value: 'To Do' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
  ];

  const priorityOptions = [
    { label: 'All Priorities', value: '' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  const handleReset = () => {
    onFilterChange({ status: '', priority: '', search: '' });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          icon={<Search className="w-4 h-4 text-gray-400" />}
        />

        <Dropdown
          options={statusOptions}
          value={filters.status}
          onChange={(value) => onFilterChange({ ...filters, status: value })}
          placeholder="Filter by status"
        />

        <Dropdown
          options={priorityOptions}
          value={filters.priority}
          onChange={(value) => onFilterChange({ ...filters, priority: value })}
          placeholder="Filter by priority"
        />
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;
