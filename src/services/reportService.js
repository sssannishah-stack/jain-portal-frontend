import api from './api';

export const reportService = {
  // Admin: Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values if API fails
      return {
        data: {
          totalStudents: 0,
          totalGroups: 0,
          pendingApprovals: 0,
          todayAttendance: 0,
          monthlyAttendance: 0,
          monthlyGatha: 0
        }
      };
    }
  },

  // Admin: Get top performers
  getTopPerformers: async (params = {}) => {
    try {
      const response = await api.get('/admin/dashboard/top-performers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching top performers:', error);
      return {
        data: {
          topByAttendance: [],
          topByGatha: []
        }
      };
    }
  },

  // Admin: Get student-wise report
  getStudentReport: async (params = {}) => {
    const response = await api.get('/admin/reports/students', { params });
    return response.data;
  },

  // Admin: Get group-wise report
  getGroupReport: async (params = {}) => {
    const response = await api.get('/admin/reports/groups', { params });
    return response.data;
  },

  // Admin: Get single student detailed report
  getStudentDetailReport: async (id, params = {}) => {
    const response = await api.get(`/admin/reports/student/${id}`, { params });
    return response.data;
  },

  // Admin: Get single group detailed report
  getGroupDetailReport: async (id, params = {}) => {
    const response = await api.get(`/admin/reports/group/${id}`, { params });
    return response.data;
  },

  // User: Get own dashboard stats
  getUserDashboard: async () => {
    const response = await api.get('/user/dashboard');
    return response.data;
  },

  // User: Get family dashboard stats
  getFamilyDashboard: async () => {
    const response = await api.get('/user/family-dashboard');
    return response.data;
  },

  // User: Get own report
  getUserReport: async (params = {}) => {
    const response = await api.get('/user/report', { params });
    return response.data;
  },

  // User: Get family report
  getFamilyReport: async (params = {}) => {
    const response = await api.get('/user/family-report', { params });
    return response.data;
  },

  // Admin: Get analytics stats for date range
  getAnalyticsStats: async (params = {}) => {
    try {
      const response = await api.get('/admin/analytics', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics stats:', error);
      return { data: null };
    }
  },

  // User: Get own analytics for date range
  getUserAnalytics: async (params = {}) => {
    const response = await api.get('/user/analytics', { params });
    return response.data;
  }
};