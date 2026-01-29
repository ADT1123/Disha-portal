// src/components/tasks/TaskCard.tsx
import React, { useState } from 'react';
import type { Task } from '../../types';
import Badge from '../shared/Badge.tsx';
import Avatar from '../shared/Avatar.tsx';
import { Calendar, MessageSquare, MoreVertical, Trash2, Edit } from 'lucide-react';
import { formatDate } from '../../utils/dateHelpers';
import { useAuth } from '../../contexts/AuthContext';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: any) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'neutral';
    }
  };

  const handleStatusChange = (newStatus: string) => {
    onUpdate(task._id, { status: newStatus });
  };

  const canEdit = 
    user?.role === 'admin' ||
    user?.role === 'manager' ||
    task.assignedTo._id === user?._id;

  const canDelete = 
    user?.role === 'admin' ||
    task.assignedBy._id === user?._id;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Priority indicator */}
      <div className={`h-1 w-full rounded-t-lg mb-3 ${
        task.priority === 'High' ? 'bg-red-500' :
        task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
      }`} />

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          )}
        </div>
        
        {canEdit && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                {canDelete && (
                  <button
                    onClick={() => {
                      onDelete(task._id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge variant={getPriorityColor(task.priority) as any} size="sm">
          {task.priority}
        </Badge>
        {task.isRecurring && (
          <Badge variant="info" size="sm">Recurring</Badge>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(task.deadline, 'MMM d')}
        </span>
        {task.comments && task.comments.length > 0 && (
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {task.comments.length}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <Avatar
          name={task.assignedTo.name}
          src={task.assignedTo.profilePic}
          size="sm"
        />
        
        {user?._id === task.assignedTo._id && task.status !== 'Completed' && (
          <button
            onClick={() => handleStatusChange(
              task.status === 'To Do' ? 'In Progress' : 'Completed'
            )}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {task.status === 'To Do' ? 'Start' : 'Complete'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
