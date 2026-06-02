import axios from "axios";

import { persist, createJSONStorage } from "zustand/middleware";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useNavigate } from "react-router-dom";

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

      logout: async () => {
        if (typeof stopLoginTimer === "function") stopLoginTimer();
        else get().stopLoginTimer?.();

        const currentId = get().memberId;
        console.log("👉 [체크] 로그아웃 요청을 보낼 ID:", currentId);

        if (currentId) {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_BACKSERVER}/api/members/logout/${currentId}`,
            );
            console.log("✅ 백엔드 응답 성공:", res.data);
          } catch (err) {
            console.error("🚨 백엔드 요청 실패 에러:", err);
          }
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

        alert("로그아웃 되었습니다.");
        window.location.href = "/";
      },

      startLoginTimer: (endTime) => {
        if (!endTime) return;

        get().stopLoginTimer();
        const currentTime = new Date().getTime();
        const remainingTime = endTime - currentTime;

        if (remainingTime > 0) {
          logoutTimer = setTimeout(() => {
            if (get().token) {
              get().logout();
            }
          }, remainingTime);
        } else {
          //이미 시간이 지난 경우 즉시 로그아웃
          get().logout();
        }
      },

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
