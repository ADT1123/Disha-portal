// src/pages/Attendance.tsx
import React, { useEffect, useState } from 'react';
import type { Attendance as AttendanceType } from '../types';
import api from '../utils/api';
import Button from '../components/shared/Button.tsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.tsx';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import toast from 'react-hot-toast';

const Attendance: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceType[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    totalWorkHours: 0,
    averageWorkHours: 0,
  });

  useEffect(() => {
    fetchAttendance();
    fetchTodayAttendance();
    fetchStats();
  }, [selectedMonth]);

  const fetchAttendance = async () => {
    try {
      const month = selectedMonth.getMonth() + 1;
      const year = selectedMonth.getFullYear();
      const response = await api.get(`/api/attendance?month=${month}&year=${year}`);
      setAttendance(response.data.attendance || []);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const response = await api.get('/api/attendance/today');
      setTodayAttendance(response.data.attendance);
    } catch (error) {
      console.error('Failed to fetch today attendance:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const month = selectedMonth.getMonth() + 1;
      const year = selectedMonth.getFullYear();
      const response = await api.get(`/api/attendance/stats?month=${month}&year=${year}`);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      await api.post('/api/attendance/check-in');
      toast.success('Checked in successfully!');
      fetchTodayAttendance();
      fetchAttendance();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/api/attendance/check-out');
      toast.success('Checked out successfully!');
      fetchTodayAttendance();
      fetchAttendance();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Check-out failed');
    }
  };

  const getMonthDays = () => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return eachDayOfInterval({ start, end });
  };

  const getAttendanceForDate = (date: Date) => {
    return attendance.find(a => 
      format(new Date(a.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'Half-Day': return 'bg-yellow-100 text-yellow-800';
      case 'Leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading attendance..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Track your daily attendance</p>
        </div>
      </div>

      {/* Today's Status & Actions */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-1">Today's Status</p>
            <h2 className="text-3xl font-bold">
              {format(new Date(), 'EEEE, MMMM d')}
            </h2>
            {todayAttendance?.checkIn && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Check-in: {format(new Date(todayAttendance.checkIn.time), 'h:mm a')}</span>
                </div>
                {todayAttendance.checkOut && (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Check-out: {format(new Date(todayAttendance.checkOut.time), 'h:mm a')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Work hours: {todayAttendance.workHours?.toFixed(2)} hrs</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {!todayAttendance?.checkIn ? (
              <Button
                variant="secondary"
                onClick={handleCheckIn}
                icon={<CheckCircle className="w-5 h-5" />}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Check In
              </Button>
            ) : !todayAttendance?.checkOut ? (
              <Button
                variant="secondary"
                onClick={handleCheckOut}
                icon={<XCircle className="w-5 h-5" />}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Check Out
              </Button>
            ) : (
              <div className="bg-white/20 px-6 py-3 rounded-lg text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Present Days</p>
          <p className="text-2xl font-bold text-green-600">{stats.presentDays}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Absent Days</p>
          <p className="text-2xl font-bold text-red-600">{stats.absentDays}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Hours</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalWorkHours.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Avg Hours/Day</p>
          <p className="text-2xl font-bold text-purple-600">{stats.averageWorkHours.toFixed(1)}</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {format(selectedMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedMonth(new Date())}
            >
              Today
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}

          {getMonthDays().map(date => {
            const dayAttendance = getAttendanceForDate(date);
            const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <div
                key={date.toISOString()}
                className={`
                  aspect-square p-2 border rounded-lg
                  ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  ${dayAttendance ? getStatusColor(dayAttendance.status) : ''}
                `}
              >
                <div className="text-sm font-medium text-center">
                  {format(date, 'd')}
                </div>
                {dayAttendance && (
                  <div className="text-xs text-center mt-1">
                    {dayAttendance.status}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
            <span className="text-sm text-gray-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
            <span className="text-sm text-gray-600">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200" />
            <span className="text-sm text-gray-600">Half-Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
            <span className="text-sm text-gray-600">Leave</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
