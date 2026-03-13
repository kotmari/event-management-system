import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState } from '../types';



// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,

//       login: (user, token) => 
//         set({ user, token }),

//       logout: () => 
//         set({ user: null, token: null }),
//     }),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );

import { api } from '../api/api'; 

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', credentials);
          set({ user: data.user, token: data.token, isLoading: false });
          return true;
        } catch (err: any) {
          set({ 
            error: err.response?.data?.message || 'Registration failed', 
            isLoading: false 
          });
          return false;
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', credentials);
          set({ user: data.user, token: data.token, isLoading: false });
          return true;
        } catch (err: any) {
          set({ 
            error: err.response?.data?.message || 'Login failed', 
            isLoading: false 
          });
          return false;
        }
      },

      logout: () => set({ user: null, token: null, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

