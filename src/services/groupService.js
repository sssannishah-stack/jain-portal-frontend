import api from './api';

export const groupService = {
  // Get all groups
  getAll: async (params = {}) => {
    const response = await api.get('/admin/groups', { params });
    return response.data;
  },

  // Get single group with members
  getById: async (id) => {
    const response = await api.get(`/admin/groups/${id}`);
    return response.data;
  },

  // Create group
  create: async (groupData) => {
    const response = await api.post('/admin/groups', groupData);
    return response.data;
  },

  // Update group
  update: async (id, groupData) => {
    const response = await api.put(`/admin/groups/${id}`, groupData);
    return response.data;
  },

  // Delete group
  delete: async (id) => {
    const response = await api.delete(`/admin/groups/${id}`);
    return response.data;
  },

  // Add member to group
  addMember: async (groupId, userId) => {
    const response = await api.post(`/admin/groups/${groupId}/members`, { userId });
    return response.data;
  },

  // Remove member from group
  removeMember: async (groupId, userId) => {
    const response = await api.delete(`/admin/groups/${groupId}/members/${userId}`);
    return response.data;
  }
};