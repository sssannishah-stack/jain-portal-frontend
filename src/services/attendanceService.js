import api from './api';

export const attendanceService = {
  // User: Mark attendance
  mark: async (data) => {
    const response = await api.post('/user/attendance', data);
    return response.data;
  },

  // User: Get own attendance
  getOwn: async (params = {}) => {
    const response = await api.get('/user/attendance', { params });
    return response.data;
  },

  // User: Get family attendance
  getFamily: async (params = {}) => {
    const response = await api.get('/user/attendance/family', { params });
    return response.data;
  },

  // Admin: Get all pending
  getPending: async (params = {}) => {
    const response = await api.get('/admin/pending-approvals', { 
      params: { ...params, type: 'attendance' } 
    });
    return response.data;
  },

  // Admin: Approve
  approve: async (id) => {
    const response = await api.put(`/admin/attendance/${id}/approve`);
    return response.data;
  },

  // Admin: Reject
  reject: async (id) => {
    const response = await api.put(`/admin/attendance/${id}/reject`);
    return response.data;
  },

  // Admin: Add for user
  addForUser: async (data) => {
    const response = await api.post('/admin/attendance/add-for-user', data);
    return response.data;
  },

  // Admin: Bulk approve
  bulkApprove: async (ids) => {
    const response = await api.post('/admin/bulk-approve', { 
      type: 'attendance', 
      ids 
    });
    return response.data;
  }
};