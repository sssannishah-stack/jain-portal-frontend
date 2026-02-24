import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  CheckCircle2,
  Users,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { attendanceService } from '../../services';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const { user, familyMembers } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [alreadyMarked, setAlreadyMarked] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const hasFamilyGroup = familyMembers && familyMembers.length > 1;
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayDisplay = format(new Date(), 'EEEE, dd MMM');

  useEffect(() => {
    checkTodayAttendance();
  }, []);

  const checkTodayAttendance = async () => {
    setChecking(true);
    try {
      const response = hasFamilyGroup 
        ? await attendanceService.getFamily({ startDate: today, endDate: today })
        : await attendanceService.getOwn({ startDate: today, endDate: today });
      
      const markedIds = (response?.data || []).map(a => a.userId?._id || a.userId);
      setAlreadyMarked(markedIds);

      const membersToSelect = hasFamilyGroup 
        ? familyMembers.filter(m => !markedIds.includes(m._id)).map(m => m._id)
        : (!markedIds.includes(user._id) ? [user._id] : []);
      
      setSelectedMembers(membersToSelect);
    } catch (error) {
      setSelectedMembers([user._id]);
    } finally {
      setChecking(false);
    }
  };

  const toggleMember = (memberId) => {
    if (alreadyMarked.includes(memberId)) return;
    
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAll = () => {
    const unmarked = (hasFamilyGroup ? familyMembers : [user])
      .filter(m => !alreadyMarked.includes(m._id))
      .map(m => m._id);
    setSelectedMembers(unmarked);
  };

  const handleSubmit = async () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member');
      return;
    }

    setLoading(true);
    try {
      await attendanceService.mark({ date: today, userIds: selectedMembers });
      setSubmitted(true);
      toast.success('Attendance marked!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (checking) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Checking status...</p>
        </div>
      </div>
    );
  }

  // Success
  if (submitted) {
    return (
      <div className="max-w-sm mx-auto pt-10">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Done! 🎉</h2>
          <p className="text-gray-500 mb-1">Attendance marked successfully</p>
          <p className="text-xs text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-full mb-6">
            ⏳ Pending admin approval
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/user/dashboard')}
              className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-orange-500 text-white font-semibold rounded-2xl"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/user/add-gatha')}
              className="w-full py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-2xl"
            >
              Add Gatha
            </button>
          </div>
        </div>
      </div>
    );
  }

  // All marked
  const allMarked = hasFamilyGroup 
    ? familyMembers.every(m => alreadyMarked.includes(m._id))
    : alreadyMarked.includes(user._id);

  if (allMarked) {
    return (
      <div className="max-w-sm mx-auto pt-10">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Done! ✓</h2>
          <p className="text-gray-500 mb-6">
            {hasFamilyGroup ? 'All family members' : 'Your'} attendance is already marked for today.
          </p>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="w-full py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-2xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-xs text-gray-500">For {todayDisplay}</p>
        </div>
      </div>

      {/* Date Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-xs">Today's Date</p>
            <p className="text-xl font-bold">{todayDisplay}</p>
          </div>
          <CalendarCheck className="w-10 h-10 text-white/50" />
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
        <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          Attendance can only be marked for today and requires admin approval.
        </p>
      </div>

      {/* Member Selection */}
      {hasFamilyGroup ? (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-primary-500" />
              Select Members
            </h3>
            <button onClick={selectAll} className="text-xs text-primary-600 font-medium">
              Select All
            </button>
          </div>

          <div className="space-y-2">
            {familyMembers.map((member) => {
              const isMarked = alreadyMarked.includes(member._id);
              const isSelected = selectedMembers.includes(member._id);
              const isYou = member._id === user._id;

              return (
                <button
                  key={member._id}
                  onClick={() => toggleMember(member._id)}
                  disabled={isMarked}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    isMarked
                      ? 'bg-green-50 border-green-200 opacity-60'
                      : isSelected
                        ? 'bg-primary-50 border-primary-500'
                        : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isMarked
                      ? 'bg-green-500 border-green-500'
                      : isSelected
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-gray-300'
                  }`}>
                    {(isMarked || isSelected) && <Check className="w-4 h-4 text-white" />}
                  </div>
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    isMarked ? 'bg-green-500' : 'bg-gradient-to-br from-primary-400 to-orange-500'
                  }`}>
                    {member.name?.charAt(0)?.toUpperCase()}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 text-sm">
                      {member.name}
                      {isYou && <span className="ml-1 text-xs text-primary-600">(You)</span>}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isMarked ? '✓ Already marked' : 'Tap to select'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            {selectedMembers.length} selected
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">Mark your attendance</p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || selectedMembers.length === 0}
        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Marking...
          </>
        ) : (
          <>
            <CalendarCheck className="w-5 h-5" />
            Mark Attendance
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        📝 Will be pending until admin approves
      </p>
    </div>
  );
};

export default MarkAttendance;