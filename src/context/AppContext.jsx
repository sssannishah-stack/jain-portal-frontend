import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jain_portal_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jain_portal_token');
      localStorage.removeItem('jain_portal_user');
    }
    return Promise.reject(error);
  }
);

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  error: null,
  familyMembers: [],
  dashboardData: null,
  dashboardLoading: false,
  students: [],
  families: [],
  pendingAttendance: [],
  pendingGatha: [],
  reportData: null,
  sidebarOpen: true,
  toast: null
};

// Action Types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_DASHBOARD_LOADING: 'SET_DASHBOARD_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  INIT_COMPLETE: 'INIT_COMPLETE',
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  SET_STUDENTS: 'SET_STUDENTS',
  ADD_STUDENT: 'ADD_STUDENT',
  UPDATE_STUDENT: 'UPDATE_STUDENT',
  DELETE_STUDENT: 'DELETE_STUDENT',
  SET_FAMILIES: 'SET_FAMILIES',
  ADD_FAMILY: 'ADD_FAMILY',
  UPDATE_FAMILY: 'UPDATE_FAMILY',
  DELETE_FAMILY: 'DELETE_FAMILY',
  SET_PENDING_ATTENDANCE: 'SET_PENDING_ATTENDANCE',
  SET_PENDING_GATHA: 'SET_PENDING_GATHA',
  UPDATE_PENDING: 'UPDATE_PENDING',
  SET_REPORT_DATA: 'SET_REPORT_DATA',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_TOAST: 'SET_TOAST',
  CLEAR_TOAST: 'CLEAR_TOAST'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_DASHBOARD_LOADING:
      return { ...state, dashboardLoading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isAdmin: action.payload.isAdmin,
        familyMembers: action.payload.familyMembers || [],
        loading: false,
        error: null
      };
    
    case ACTIONS.LOGOUT:
      return { ...initialState, loading: false };
    
    case ACTIONS.INIT_COMPLETE:
      return { ...state, loading: false };
    
    case ACTIONS.SET_DASHBOARD_DATA:
      return { ...state, dashboardData: action.payload, dashboardLoading: false };
    
    case ACTIONS.SET_STUDENTS:
      return { ...state, students: action.payload };
    
    case ACTIONS.ADD_STUDENT:
      return { ...state, students: [...state.students, action.payload] };
    
    case ACTIONS.UPDATE_STUDENT:
      return {
        ...state,
        students: state.students.map(s => s._id === action.payload._id ? action.payload : s)
      };
    
    case ACTIONS.DELETE_STUDENT:
      return { ...state, students: state.students.filter(s => s._id !== action.payload) };
    
    case ACTIONS.SET_FAMILIES:
      return { ...state, families: action.payload };
    
    case ACTIONS.ADD_FAMILY:
      return { ...state, families: [...state.families, action.payload] };
    
    case ACTIONS.UPDATE_FAMILY:
      return {
        ...state,
        families: state.families.map(f => f._id === action.payload._id ? action.payload : f)
      };
    
    case ACTIONS.DELETE_FAMILY:
      return { ...state, families: state.families.filter(f => f._id !== action.payload) };
    
    case ACTIONS.SET_PENDING_ATTENDANCE:
      return { ...state, pendingAttendance: action.payload };
    
    case ACTIONS.SET_PENDING_GATHA:
      return { ...state, pendingGatha: action.payload };
    
    case ACTIONS.UPDATE_PENDING:
      return {
        ...state,
        pendingAttendance: state.pendingAttendance.filter(a => !action.payload.attendanceIds?.includes(a._id)),
        pendingGatha: state.pendingGatha.filter(g => !action.payload.gathaIds?.includes(g._id))
      };
    
    case ACTIONS.SET_REPORT_DATA:
      return { ...state, reportData: action.payload };
    
    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case ACTIONS.SET_TOAST:
      return { ...state, toast: action.payload };
    
    case ACTIONS.CLEAR_TOAST:
      return { ...state, toast: null };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext(null);

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize - check existing session
  useEffect(() => {
    const initApp = async () => {
      try {
        const token = localStorage.getItem('jain_portal_token');
        const userData = localStorage.getItem('jain_portal_user');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({
            type: ACTIONS.LOGIN_SUCCESS,
            payload: {
              user,
              isAdmin: user.role === 'admin',
              familyMembers: user.familyMembers || []
            }
          });
        } else {
          dispatch({ type: ACTIONS.INIT_COMPLETE });
        }
      } catch (error) {
        console.error('Init error:', error);
        localStorage.removeItem('jain_portal_token');
        localStorage.removeItem('jain_portal_user');
        dispatch({ type: ACTIONS.INIT_COMPLETE });
      }
    };

    initApp();
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => dispatch({ type: ACTIONS.CLEAR_TOAST }), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  // Helper: Show Toast
  const showToast = useCallback((type, message) => {
    dispatch({ type: ACTIONS.SET_TOAST, payload: { type, message } });
  }, []);

  // ==================== AUTH ====================

  const adminLogin = async (username, password) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.CLEAR_ERROR });
      
      const { data } = await api.post('/admin/login', { username, password });
      
      if (data.success) {
        const userData = { ...data.admin, role: 'admin' };
        localStorage.setItem('jain_portal_token', data.token);
        localStorage.setItem('jain_portal_user', JSON.stringify(userData));
        
        dispatch({
          type: ACTIONS.LOGIN_SUCCESS,
          payload: { user: userData, isAdmin: true, familyMembers: [] }
        });
        
        return { success: true };
      }
      
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Login failed' });
      return { success: false, message: 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  const userLogin = async (name, password) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.CLEAR_ERROR });
      
      const { data } = await api.post('/user/login', { name, password });
      
      if (data.success) {
        const userData = { ...data.user, role: 'user' };
        localStorage.setItem('jain_portal_token', data.token);
        localStorage.setItem('jain_portal_user', JSON.stringify(userData));
        
        dispatch({
          type: ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: userData,
            isAdmin: false,
            familyMembers: data.user.familyMembers || []
          }
        });
        
        return { success: true };
      }
      
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Login failed' });
      return { success: false, message: 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('jain_portal_token');
    localStorage.removeItem('jain_portal_user');
    dispatch({ type: ACTIONS.LOGOUT });
    window.location.href = '/';
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  // ==================== DASHBOARD ====================

  const fetchAdminDashboard = async () => {
    try {
      dispatch({ type: ACTIONS.SET_DASHBOARD_LOADING, payload: true });
      const { data } = await api.get('/admin/dashboard');
      
      if (data.success) {
        dispatch({ type: ACTIONS.SET_DASHBOARD_DATA, payload: data });
        return { success: true };
      }
      
      dispatch({ type: ACTIONS.SET_DASHBOARD_LOADING, payload: false });
      return { success: false };
    } catch (error) {
      console.error('Dashboard error:', error);
      // Return mock data for testing if API fails
      const mockData = {
        today: { attendance: 0, gatha: 0 },
        monthly: { attendance: 0, newGatha: 0, revisionGatha: 0 },
        pending: { attendance: 0, gatha: 0 },
        totals: { students: 0, families: 0 },
        weeklyTrend: []
      };
      dispatch({ type: ACTIONS.SET_DASHBOARD_DATA, payload: mockData });
      return { success: false };
    }
  };

  const fetchUserDashboard = async () => {
    try {
      dispatch({ type: ACTIONS.SET_DASHBOARD_LOADING, payload: true });
      const { data } = await api.get('/user/dashboard');
      
      if (data.success) {
        dispatch({ type: ACTIONS.SET_DASHBOARD_DATA, payload: data });
        return { success: true };
      }
      
      dispatch({ type: ACTIONS.SET_DASHBOARD_LOADING, payload: false });
      return { success: false };
    } catch (error) {
      console.error('Dashboard error:', error);
      const mockData = {
        today: { attendance: [] },
        monthly: { attendance: 0, newGatha: 0, revisionGatha: 0 },
        pending: { attendance: 0, gatha: 0 },
        streak: 0
      };
      dispatch({ type: ACTIONS.SET_DASHBOARD_DATA, payload: mockData });
      return { success: false };
    }
  };

  // ==================== STUDENTS ====================

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/users');
      if (data.success) {
        dispatch({ type: ACTIONS.SET_STUDENTS, payload: data.users });
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Fetch students error:', error);
      return { success: false };
    }
  };

  const addStudent = async (studentData) => {
    try {
      const { data } = await api.post('/users', studentData);
      if (data.success) {
        dispatch({ type: ACTIONS.ADD_STUDENT, payload: data.user });
        showToast('success', 'Student added successfully');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add student';
      showToast('error', message);
      return { success: false, message };
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const { data } = await api.put(`/users/${id}`, studentData);
      if (data.success) {
        dispatch({ type: ACTIONS.UPDATE_STUDENT, payload: data.user });
        showToast('success', 'Student updated successfully');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update student';
      showToast('error', message);
      return { success: false, message };
    }
  };

  const deleteStudent = async (id) => {
    try {
      const { data } = await api.delete(`/users/${id}`);
      if (data.success) {
        dispatch({ type: ACTIONS.DELETE_STUDENT, payload: id });
        showToast('success', 'Student deactivated');
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      showToast('error', 'Failed to delete student');
      return { success: false };
    }
  };

  // ==================== FAMILIES ====================

  const fetchFamilies = async () => {
    try {
      const { data } = await api.get('/families');
      if (data.success) {
        dispatch({ type: ACTIONS.SET_FAMILIES, payload: data.families });
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Fetch families error:', error);
      return { success: false };
    }
  };

  const addFamily = async (familyData) => {
    try {
      const { data } = await api.post('/families', familyData);
      if (data.success) {
        dispatch({ type: ACTIONS.ADD_FAMILY, payload: data.family });
        showToast('success', 'Family created successfully');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create family';
      showToast('error', message);
      return { success: false, message };
    }
  };

  const updateFamily = async (id, familyData) => {
    try {
      const { data } = await api.put(`/families/${id}`, familyData);
      if (data.success) {
        dispatch({ type: ACTIONS.UPDATE_FAMILY, payload: data.family });
        showToast('success', 'Family updated successfully');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update family';
      showToast('error', message);
      return { success: false, message };
    }
  };

  const deleteFamily = async (id) => {
    try {
      const { data } = await api.delete(`/families/${id}`);
      if (data.success) {
        dispatch({ type: ACTIONS.DELETE_FAMILY, payload: id });
        showToast('success', 'Family deleted');
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      showToast('error', 'Failed to delete family');
      return { success: false };
    }
  };

  // ==================== ATTENDANCE ====================

  const markAttendance = async (userId, date) => {
  try {
    // 🔍 LOG THE EXACT PAYLOAD
    const payload = {
      userId: String(userId),  // Ensure it's a string
      date: new Date(date).toISOString().split('T')[0] // Format: "2025-01-07"
    };
    
    console.log('📤 Sending attendance →', payload);
    console.log('📤 Request headers →', api.defaults.headers);
    
    const { data } = await api.post('/attendance', payload);
    
    console.log('✅ Attendance success:', data);
    showToast('success', 'Attendance marked successfully');
    return { success: true, data: data.attendance };
    
  } catch (error) {
    console.error('❌ Attendance failed');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Full error:', error.response?.data);
    
    const message = error.response?.data?.message || 'Failed to mark attendance';
    showToast('error', message);
    return { success: false, message };
  }
};

  const adminMarkAttendance = async (userId, date) => {
    try {
      const { data } = await api.post('/admin/attendance', { userId, date });
      if (data.success) {
        showToast('success', 'Attendance marked and approved');
        return { success: true, data: data.attendance };
      }
      return { success: false, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark attendance';
      showToast('error', message);
      return { success: false, message };
    }
  };

  const fetchPendingAttendance = async () => {
    try {
      const { data } = await api.get('/admin/attendance/pending');
      if (data.success) {
        dispatch({ type: ACTIONS.SET_PENDING_ATTENDANCE, payload: data.pending });
      }
    } catch (error) {
      console.error('Fetch pending attendance error:', error);
    }
  };

  const approveAttendance = async (id, status) => {
    try {
      const { data } = await api.put(`/admin/attendance/${id}/approve`, { status });
      if (data.success) {
        dispatch({ type: ACTIONS.UPDATE_PENDING, payload: { attendanceIds: [id] } });
        showToast('success', `Attendance ${status}`);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      showToast('error', 'Failed to update attendance');
      return { success: false };
    }
  };

  const bulkApproveAttendance = async (ids, status) => {
    try {
      const { data } = await api.post('/admin/attendance/bulk-approve', { ids, status });
      if (data.success) {
        dispatch({ type: ACTIONS.UPDATE_PENDING, payload: { attendanceIds: ids } });
        showToast('success', data.message);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      showToast('error', 'Failed to bulk update');
      return { success: false };
    }
  };

  // ==================== GATHA ====================

  const addGatha = async (gathaData) => {
    try {
      const { data } = await api.post('/gatha', gathaData);
      if (data.success) {
        showToast('success', 'Gatha added successfully');
        return { success: true, data: data.gatha };
      }
      return { success: false, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add gatha';
      showToast('error', message);
      return { success: false, message };
    }
  };

  const adminAddGatha = async (gathaData) => {
    try {
      const { data } = await api.post('/admin/gatha', gathaData);
      if (data.success) {
        showToast('success', 'Gatha added and approved');
        return { success: true, data: data.gatha };
      }
      return { success: false, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add gatha';
      showToast('error', message);
      return { success: false, message };
    }
  };

  const fetchPendingGatha = async () => {
    try {
      const { data } = await api.get('/admin/gatha/pending');
      if (data.success) {
        dispatch({ type: ACTIONS.SET_PENDING_GATHA, payload: data.pending });
      }
    } catch (error) {
      console.error('Fetch pending gatha error:', error);
    }
  };

  const approveGatha = async (id, status) => {
    try {
      const { data } = await api.put(`/admin/gatha/${id}/approve`, { status });
      if (data.success) {
        dispatch({ type: ACTIONS.UPDATE_PENDING, payload: { gathaIds: [id] } });
        showToast('success', `Gatha ${status}`);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      showToast('error', 'Failed to update gatha');
      return { success: false };
    }
  };

  const bulkApproveGatha = async (ids, status) => {
    try {
      const { data } = await api.post('/admin/gatha/bulk-approve', { ids, status });
      if (data.success) {
        dispatch({ type: ACTIONS.UPDATE_PENDING, payload: { gathaIds: ids } });
        showToast('success', data.message);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      showToast('error', 'Failed to bulk update');
      return { success: false };
    }
  };

  // ==================== REPORTS ====================

  const fetchUserReport = async (startDate, endDate, userId = null) => {
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (userId) params.append('userId', userId);
      
      const { data } = await api.get(`/user/report?${params}`);
      if (data.success) {
        dispatch({ type: ACTIONS.SET_REPORT_DATA, payload: data });
        return { success: true, data };
      }
      return { success: false };
    } catch (error) {
      console.error('Report error:', error);
      return { success: false };
    }
  };

  const fetchStudentReport = async (startDate, endDate) => {
    try {
      const { data } = await api.get(`/admin/reports/students?startDate=${startDate}&endDate=${endDate}`);
      if (data.success) {
        dispatch({ type: ACTIONS.SET_REPORT_DATA, payload: data });
        return { success: true, data };
      }
      return { success: false };
    } catch (error) {
      console.error('Report error:', error);
      return { success: false };
    }
  };

  const fetchFamilyReport = async (startDate, endDate) => {
    try {
      const { data } = await api.get(`/admin/reports/families?startDate=${startDate}&endDate=${endDate}`);
      if (data.success) {
        dispatch({ type: ACTIONS.SET_REPORT_DATA, payload: data });
        return { success: true, data };
      }
      return { success: false };
    } catch (error) {
      console.error('Report error:', error);
      return { success: false };
    }
  };

  const exportReport = async (startDate, endDate, type = null, id = null) => {
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (type) params.append('type', type);
      if (id) params.append('id', id);
      
      const { data } = await api.get(`/admin/reports/export?${params}`);
      if (data.success) {
        return { success: true, data };
      }
      return { success: false };
    } catch (error) {
      showToast('error', 'Failed to export report');
      return { success: false };
    }
  };

  // ==================== UI ====================

  const toggleSidebar = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_SIDEBAR });
  }, []);

  // Context value
  const value = {
    ...state,
    adminLogin,
    userLogin,
    logout,
    clearError,
    fetchAdminDashboard,
    fetchUserDashboard,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    fetchFamilies,
    addFamily,
    updateFamily,
    deleteFamily,
    markAttendance,
    adminMarkAttendance,
    fetchPendingAttendance,
    approveAttendance,
    bulkApproveAttendance,
    addGatha,
    adminAddGatha,
    fetchPendingGatha,
    approveGatha,
    bulkApproveGatha,
    fetchUserReport,
    fetchStudentReport,
    fetchFamilyReport,
    exportReport,
    toggleSidebar,
    showToast
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;