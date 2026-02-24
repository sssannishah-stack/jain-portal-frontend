import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Send, CheckCircle } from 'lucide-react';
import { Card, Button } from '../../components/common';
import { userService, attendanceService } from '../../services';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AddAttendanceForUser = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(t('messages.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      toast.error(t('validation.selectAtLeastOne'));
      return;
    }

    setSubmitting(true);
    try {
      await attendanceService.addForUser({
        userIds: selectedUsers,
        date
      });
      toast.success(t('user.attendanceMarked'));
      setSubmitted(true);
      setSelectedUsers([]);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      toast.error(t('messages.somethingWrong'));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedUsers(users.map(u => u._id));
  };

  const deselectAll = () => {
    setSelectedUsers([]);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('user.attendanceMarked')}
          </h3>
          <p className="text-gray-500">{t('admin.attendanceAddedForStudents')}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.addAttendanceForStudent')}</h1>
        <p className="text-gray-500">{t('admin.addAttendanceDesc')}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400" />
              {t('common.date')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* User Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4 text-gray-400" />
                {t('admin.selectStudent')}
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={selectAll} className="text-sm text-primary-600 hover:text-primary-700">
                  {t('common.selectAll')}
                </button>
                <button type="button" onClick={deselectAll} className="text-sm text-gray-500 hover:text-gray-700">
                  {t('common.deselectAll')}
                </button>
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder={t('placeholder.searchStudents')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            {/* User List */}
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl">
              {loading ? (
                <div className="p-4 text-center text-gray-500">{t('common.loading')}</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">{t('common.noData')}</div>
              ) : (
                filteredUsers.map(user => (
                  <label
                    key={user._id}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${
                      selectedUsers.includes(user._id) ? 'bg-primary-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUser(user._id)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="flex-1 font-medium text-gray-700">{user.name}</span>
                    {user.familyGroupId && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {user.familyGroupId.groupName}
                      </span>
                    )}
                  </label>
                ))
              )}
            </div>

            <p className="text-sm text-gray-500">
              {selectedUsers.length} {t('admin.studentsSelected')}
            </p>
          </div>

          <Button
            type="submit"
            loading={submitting}
            disabled={selectedUsers.length === 0}
            icon={Send}
            className="w-full"
            size="lg"
          >
            {t('user.markAttendance')}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddAttendanceForUser;