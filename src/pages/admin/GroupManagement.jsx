import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users,
  UserMinus,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { Card, Button, Loader, Modal } from '../../components/common';
import { groupService, userService } from '../../services';
import toast from 'react-hot-toast';

const GroupManagement = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  
  // Modal states
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    groupName: '',
    groupPassword: '',
    description: '',
    members: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, usersRes] = await Promise.all([
        groupService.getAll({ limit: 100 }),
        userService.getAll({ limit: 500 })
      ]);
      setGroups(groupsRes.data || []);
      setAllUsers(usersRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.groupName?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleGroupExpand = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleAddGroup = () => {
    setSelectedGroup(null);
    setFormData({
      groupName: '',
      groupPassword: '',
      description: '',
      members: []
    });
    setShowGroupForm(true);
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setFormData({
      groupName: group.groupName || '',
      groupPassword: group.groupPassword || '',
      description: group.description || '',
      members: group.members?.map(m => m._id) || []
    });
    setShowGroupForm(true);
  };

  const handleDeleteClick = (group) => {
    setSelectedGroup(group);
    setShowDeleteConfirm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (selectedGroup) {
        await groupService.update(selectedGroup._id, formData);
        toast.success('Group updated successfully!');
      } else {
        await groupService.create(formData);
        toast.success('Group created successfully!');
      }
      setShowGroupForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save group');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await groupService.delete(selectedGroup._id);
      toast.success('Group deleted successfully!');
      setShowDeleteConfirm(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete group');
    }
  };

  const handleRemoveMember = async (groupId, userId) => {
    try {
      await groupService.removeMember(groupId, userId);
      toast.success('Member removed successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const toggleMember = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Family Groups</h1>
          <p className="text-gray-500 mt-1">Total Groups: {groups.length}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchData} variant="secondary" icon={RefreshCw}>
            Refresh
          </Button>
          <Button onClick={handleAddGroup} icon={Plus}>
            Create Group
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </Card>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Groups Found</h3>
          <p className="text-gray-500 mb-6">Create family groups to allow shared login</p>
          <Button onClick={handleAddGroup} icon={Plus}>Create Group</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group._id} className="overflow-hidden">
              {/* Group Header */}
              <div className="p-5 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{group.groupName}</h3>
                    <p className="text-purple-200 text-sm mt-1">
                      {group.members?.length || 0} members
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditGroup(group)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(group)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {group.description && (
                  <p className="text-purple-200 text-sm mt-2">{group.description}</p>
                )}
              </div>

              {/* Members Section */}
              <div className="p-4">
                <button
                  onClick={() => toggleGroupExpand(group._id)}
                  className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-gray-900"
                >
                  <span className="font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Members
                  </span>
                  {expandedGroups[group._id] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {expandedGroups[group._id] && (
                  <div className="mt-3 space-y-2">
                    {group.members && group.members.length > 0 ? (
                      group.members.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
                              {member.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{member.name}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveMember(group._id, member._id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Remove from group"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No members</p>
                    )}
                  </div>
                )}
              </div>

              {/* Group Password */}
              <div className="px-4 pb-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800 font-medium mb-1">Group Password:</p>
                  <p className="text-sm font-mono text-amber-900">{group.groupPassword}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Group Modal */}
      <Modal
        isOpen={showGroupForm}
        onClose={() => setShowGroupForm(false)}
        title={selectedGroup ? 'Edit Group' : 'Create New Group'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
              <input
                type="text"
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Sharma Family"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Password *</label>
              <input
                type="text"
                value={formData.groupPassword}
                onChange={(e) => setFormData({ ...formData, groupPassword: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter group password"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Optional description"
            />
          </div>

          {/* Member Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Members ({formData.members.length} selected)
            </label>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl">
              {allUsers.length > 0 ? (
                allUsers.map(user => (
                  <label
                    key={user._id}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${
                      formData.members.includes(user._id) ? 'bg-primary-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.members.includes(user._id)}
                      onChange={() => toggleMember(user._id)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      {user.familyGroupId && user.familyGroupId._id !== selectedGroup?._id && (
                        <p className="text-xs text-orange-600">Already in: {user.familyGroupId.groupName}</p>
                      )}
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">No users available</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowGroupForm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={formLoading} className="flex-1">
              {selectedGroup ? 'Update Group' : 'Create Group'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Group"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedGroup?.groupName}</strong>? All members will be removed from this group.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GroupManagement;