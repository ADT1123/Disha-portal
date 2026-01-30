// src/pages/Team.tsx
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import MemberCard from '../components/team/MemberCard';
import ProfileSlidePanel from '../components/team/ProfileSlidePanel';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Search, Users as UsersIcon } from 'lucide-react';

// Define User interface locally - DON'T import from types
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  department?: string;
  designation?: string;
  profilePic?: string;
  status?: 'Available' | 'Busy' | 'On Leave' | 'Offline';
  phone?: string;
  joiningDate?: string;
}

const Team: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/api/users');
      setMembers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || member.role === filterRole;
    const matchesDepartment = !filterDepartment || member.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const departments = [...new Set(members.map(m => m.department).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading team..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Directory</h1>
          <p className="text-gray-600 mt-1">
            {filteredMembers.length} members
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {members.filter(m => m.status === 'Available').length} available
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
          </select>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <UsersIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No team members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(member => (
            <MemberCard
              key={member._id}
              member={member}
              onClick={() => setSelectedMember(member)}
            />
          ))}
        </div>
      )}

      {/* Profile Panel */}
      {selectedMember && (
        <ProfileSlidePanel
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};

export default Team;
