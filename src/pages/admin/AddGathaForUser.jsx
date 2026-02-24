import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Send, CheckCircle, BookOpen, Plus, RefreshCw } from 'lucide-react';
import { Card, Button } from '../../components/common';
import { userService, gathaService } from '../../services';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AddGathaForUser = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [gathaType, setGathaType] = useState('new');
  const [gathaCount, setGathaCount] = useState(1);
  const [gathaDetails, setGathaDetails] = useState('');
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
      await gathaService.addForUser({
        userIds: selectedUsers,
        date,
        gathaType,
        gathaCount,
        gathaDetails
      });
      toast.success(t('user.gathaAdded'));
      setSubmitted(true);
      setSelectedUsers([]);
      setGathaCount(1);
      setGathaDetails('');
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
            {t('user.gathaAdded')}
          </h3>
          <p className="text-gray-500">{t('admin.gathaAddedForStudents')}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.addGathaForStudent')}</h1>
        <p className="text-gray-500">{t('admin.addGathaDesc')}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gatha Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('user.gathaType')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGathaType('new')}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  gathaType === 'new'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">{t('user.newGatha')}</span>
              </button>
              <button
                type="button"
                onClick={() => setGathaType('revision')}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  gathaType === 'revision'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">{t('user.revisionGatha')}</span>
              </button>
            </div>
          </div>

          {/* Date */}
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

          {/* Gatha Count */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <BookOpen className="w-4 h-4 text-gray-400" />
              {t('user.gathaCount')}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGathaCount(Math.max(1, gathaCount - 1))}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-xl font-bold"
              >
                -
              </button>
              <input
                type="number"
                value={gathaCount}
                onChange={(e) => setGathaCount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setGathaCount(gathaCount + 1)}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-xl font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Gatha Details */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('user.gathaDetails')} ({t('common.optional')})
            </label>
            <textarea
              value={gathaDetails}
              onChange={(e) => setGathaDetails(e.target.value)}
              placeholder={t('placeholder.gathaDetails')}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* User Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User className="w-4 h-4 text-gray-400" />
              {t('admin.selectStudent')}
            </label>

            <input
              type="text"
              placeholder={t('placeholder.searchStudents')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl">
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
                    <span className="font-medium text-gray-700">{user.name}</span>
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
            {t('user.addGatha')}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddGathaForUser;