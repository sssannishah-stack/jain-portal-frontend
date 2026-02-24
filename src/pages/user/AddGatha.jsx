import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  RefreshCw,
  CheckCircle2,
  Users,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Minus,
  Check
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { gathaService } from '../../services';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AddGatha = () => {
  const navigate = useNavigate();
  const { user, familyMembers } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [gathaType, setGathaType] = useState('new');
  const [gathaCount, setGathaCount] = useState(1);
  const [gathaDetails, setGathaDetails] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([user?._id]);

  const hasFamilyGroup = familyMembers && familyMembers.length > 1;
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayDisplay = format(new Date(), 'EEEE, dd MMM');

  const toggleMember = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== memberId);
      }
      return [...prev, memberId];
    });
  };

  const selectAll = () => {
    setSelectedMembers(familyMembers.map(m => m._id));
  };

  const handleSubmit = async () => {
    if (selectedMembers.length === 0 || gathaCount < 1) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await gathaService.add({
        date: today,
        userIds: selectedMembers,
        gathaType,
        gathaCount,
        gathaDetails
      });
      setSubmitted(true);
      toast.success('Gatha added!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add gatha');
    } finally {
      setLoading(false);
    }
  };

  // Success
  if (submitted) {
    return (
      <div className="max-w-sm mx-auto pt-10">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Added! 🎉</h2>
          <p className="text-gray-500 mb-1">
            {gathaCount} {gathaType === 'new' ? 'new' : 'revision'} gatha recorded
          </p>
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
              onClick={() => {
                setSubmitted(false);
                setGathaCount(1);
                setGathaDetails('');
              }}
              className="w-full py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-2xl"
            >
              Add More Gatha
            </button>
          </div>
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
          <h1 className="text-xl font-bold text-gray-900">Add Gatha</h1>
          <p className="text-xs text-gray-500">For {todayDisplay}</p>
        </div>
      </div>

      {/* Date Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-xs">Recording for</p>
            <p className="text-xl font-bold">{todayDisplay}</p>
          </div>
          <BookOpen className="w-10 h-10 text-white/50" />
        </div>
      </div>

      {/* Type Selection */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Gatha Type</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setGathaType('new')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              gathaType === 'new'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              gathaType === 'new' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <Plus className="w-6 h-6" />
            </div>
            <span className={`font-semibold text-sm ${gathaType === 'new' ? 'text-green-700' : 'text-gray-600'}`}>
              New
            </span>
          </button>

          <button
            onClick={() => setGathaType('revision')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              gathaType === 'revision'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              gathaType === 'revision' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <RefreshCw className="w-6 h-6" />
            </div>
            <span className={`font-semibold text-sm ${gathaType === 'revision' ? 'text-blue-700' : 'text-gray-600'}`}>
              Revision
            </span>
          </button>
        </div>
      </div>

      {/* Count */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Number of Gatha</h3>
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => setGathaCount(Math.max(1, gathaCount - 1))}
            className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center"
          >
            <Minus className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <input
              type="number"
              value={gathaCount}
              onChange={(e) => setGathaCount(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-20 text-center text-3xl font-bold text-gray-900 border-0 focus:outline-none"
            />
            <p className="text-xs text-gray-500">gathas</p>
          </div>
          
          <button
            onClick={() => setGathaCount(gathaCount + 1)}
            className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Quick buttons */}
        <div className="flex justify-center gap-2 mt-3">
          {[1, 3, 5, 10].map(num => (
            <button
              key={num}
              onClick={() => setGathaCount(num)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium ${
                gathaCount === num ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm">Details (Optional)</h3>
        <textarea
          value={gathaDetails}
          onChange={(e) => setGathaDetails(e.target.value)}
          placeholder="Gatha names or notes..."
          rows={2}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
        />
      </div>

      {/* Family Selection */}
      {hasFamilyGroup && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-primary-500" />
              For Members
            </h3>
            <button onClick={selectAll} className="text-xs text-primary-600 font-medium">
              Select All
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {familyMembers.map((member) => {
              const isSelected = selectedMembers.includes(member._id);
              const isYou = member._id === user._id;

              return (
                <button
                  key={member._id}
                  onClick={() => toggleMember(member._id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-primary-50 border-primary-500'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {member.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-gray-600'}`}>
                    {isYou ? 'You' : member.name?.split(' ')[0]}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || selectedMembers.length === 0}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <BookOpen className="w-5 h-5" />
            Add {gathaCount} {gathaType === 'new' ? 'New' : 'Revision'} Gatha
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        📝 Will be pending until admin approves
      </p>
    </div>
  );
};

export default AddGatha;