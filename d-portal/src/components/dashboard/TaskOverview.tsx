// src/components/dashboard/TaskOverview.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Badge from '../shared/Badge';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  _id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
  deadline: string;
  assignedTo: {
    name: string;
  };
}

const TaskOverview: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/tasks?limit=5');
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'neutral';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'To Do': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
        <button
          onClick={() => navigate('/tasks')}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No tasks assigned yet</p>
          <button
            onClick={() => navigate('/tasks')}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task._id}
              onClick={() => navigate('/tasks')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {task.title}
                </h3>
                <Badge variant={getPriorityColor(task.priority) as any} size="sm">
                  {task.priority}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(new Date(task.deadline), 'MMM d, h:mm a')}
                  </span>
                </div>
                <Badge variant={getStatusColor(task.status) as any} size="sm">
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskOverview;
