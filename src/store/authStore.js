import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Admin State
      admin: null,
      adminToken: null,
      isAdminAuthenticated: false,

      // User State
      user: null,
      userToken: null,
      isUserAuthenticated: false,
      familyMembers: [],
      familyGroupId: null,

      // Admin Actions
      setAdmin: (admin, token) => {
        console.log('Setting admin:', admin, 'token:', token ? 'exists' : 'null');
        set({
          admin,
          adminToken: token,
          isAdminAuthenticated: true,
          // Clear user state when admin logs in
          user: null,
          userToken: null,
          isUserAuthenticated: false,
          familyMembers: [],
          familyGroupId: null
        });
      },

      // User Actions
      setUser: (user, token, familyMembers = [], familyGroupId = null) => {
        console.log('Setting user:', user, 'token:', token ? 'exists' : 'null');
        set({
          user,
          userToken: token,
          isUserAuthenticated: true,
          familyMembers: familyMembers.length > 0 ? familyMembers : [user],
          familyGroupId,
          // Clear admin state when user logs in
          admin: null,
          adminToken: null,
          isAdminAuthenticated: false
        });
      },

      // Logout
      logout: () => {
        console.log('Logging out');
        set({
          admin: null,
          adminToken: null,
          isAdminAuthenticated: false,
          user: null,
          userToken: null,
          isUserAuthenticated: false,
          familyMembers: [],
          familyGroupId: null
        });
      },

      // Get current token
      getToken: () => {
        const state = get();
        return state.adminToken || state.userToken;
      },

      // Check if user has family
      hasFamily: () => {
        const state = get();
        return state.familyMembers && state.familyMembers.length > 1;
      }
    }),
    {
      name: 'jain-pathshala-auth',
      partialize: (state) => ({
        admin: state.admin,
        adminToken: state.adminToken,
        isAdminAuthenticated: state.isAdminAuthenticated,
        user: state.user,
        userToken: state.userToken,
        isUserAuthenticated: state.isUserAuthenticated,
        familyMembers: state.familyMembers,
        familyGroupId: state.familyGroupId
      })
    }
  )
);