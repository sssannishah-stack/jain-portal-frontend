import api from './api';

export const gathaService = {
  // User: Add gatha
  add: async (data) => {
    const response = await api.post('/user/gatha', data);
    return response.data;
  },

  // User: Get own gatha
  getOwn: async (params = {}) => {
    const response = await api.get('/user/gatha', { params });
    return response.data;
  },

  // User: Get family gatha
  getFamily: async (params = {}) => {
    const response = await api.get('/user/gatha/family', { params });
    return response.data;
  },

  // Admin: Get all pending
  getPending: async (params = {}) => {
    const response = await api.get('/admin/pending-approvals', { 
      params: { ...params, type: 'gatha' } 
    });
    return response.data;
  },

  // Admin: Approve
  approve: async (id) => {
    const response = await api.put(`/admin/gatha/${id}/approve`);
    return response.data;
  },

  // Admin: Reject
  reject: async (id) => {
    const response = await api.put(`/admin/gatha/${id}/reject`);
    return response.data;
  },

  // Admin: Add for user
  addForUser: async (data) => {
    const response = await api.post('/admin/gatha/add-for-user', data);
    return response.data;
  },

  // Admin: Bulk approve
  bulkApprove: async (ids) => {
    const response = await api.post('/admin/bulk-approve', { 
      type: 'gatha', 
      ids 
    });
    return response.data;
  }
};