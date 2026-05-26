import axios from "axios";

import { persist, createJSONStorage } from "zustand/middleware";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

let alertTimer = null;
let logoutTimer = null;

const useAuthStore = create(
  persist(
    (set, get) => ({
      memberId: null,
      memberThumb: null,
      memberNickname: null,
      admin: null,
      token: null,
      endTime: null,
      isReady: false,

      //타이머 정지 함수
      stopLoginTimer: () => {
        if (alertTimer) clearTimeout(alertTimer);
        if (logoutTimer) clearTimeout(logoutTimer);
      },

      login: (data) => {
        set({
          memberId: data.memberId,
          memberThumb: data.memberThumb,
          memberNickname: data.memberNickname,
          admin: data.admin,
          token: data.token,
          endTime: data.endTime,
        });
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        get().startLoginTimer(data.endTime);
      },

      updateToken: () => {},

      logout: () => {
        get().stopLoginTimer();
        const currentId = get().memberId;
        if (currentId) {
          axios
            .post(
              `${import.meta.env.VITE_BACKSERVER}/member/logout/${currentId}`,
            )
            .catch(() => {});
        }
        set({
          memberId: null,
          memberThumb: null,
          memberNickname: null,
          admin: null,
          token: null,
          endTime: null,
        });

        delete axios.defaults.headers.common["Authorization"];

        localStorage.removeItem("auth-key");
      },

      startLoginTimer: () => {},

      setReady: (ready) => {
        set({ isReady: ready });
      },
      setThumb: (thumb) => {
        set({ memberThumb: thumb });
      },
      setNickname: (memberNickname) => {
        set({ memberNickname });
      },
    }),
    {
      //새로고침해도 로그인 상태 유지
      name: "auth-key",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        memberId: state.memberId,
        memberThumb: state.memberThumb,
        memberNickname: state.memberNickname,
        admin: state.admin,
        token: state.token,
        endTime: state.endTime,
      }),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setReady(true);

          if (state.token) {
            axios.defaults.headers.common["Authorization"] =
              `Bearer ${state.token}`;
            state.startLoginTimer(state.endTime);
          }
        }
      },
    },
  ),
);

const useUserStore = create(
  devtools((set) => ({
    users: [],
    currentUser: null,
    isLoading: false,

    setUsers: (users) => set({ users }),
    setCurrentUser: (user) => set({ currentUser: user }),
    setLoading: (isLoading) => set({ isLoading }),
    clearUser: () => set({ currentUser: null }),
  })),
);

export { useAuthStore, useUserStore };
