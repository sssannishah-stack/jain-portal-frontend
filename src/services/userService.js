import api from './api';

export const userService = {
  // Get all users
  getAll: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get single user
  getById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Create user
  create: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  // Update user
  update: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  delete: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get user credentials (admin only)
  getCredentials: async (id) => {
    const response = await api.get(`/admin/users/${id}/credentials`);
    return response.data;
  },

  // Get users not in any group
  getUnassigned: async () => {
    const response = await api.get('/admin/users/unassigned');
    return response.data;
  }
};