import api from './api';

export const authService = {
  // Admin login - using name and password
  adminLogin: async (credentials) => {
    try {
      const response = await api.post('/auth/admin/login', {
        name: credentials.name,
        password: credentials.password
      });
      console.log('Admin login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error.response?.data || error);
      throw error;
    }
  },

  // User login - using name and password
  userLogin: async (credentials) => {
    try {
      const response = await api.post('/auth/user/login', {
        name: credentials.name,
        password: credentials.password
      });
      console.log('User login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('User login error:', error.response?.data || error);
      throw error;
    }
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.get('/auth/verify-token');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};