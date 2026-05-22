import axios from "axios";
import Swal from "sweetalert2";

import { persist, createJSONStorage } from "zustand/middleware";
import { successAlert } from "../utils/alert";

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useUserStore = create(devtools((set) => ({
    users:      [],
    currentUser: null,
    isLoading:  false,

    setUsers:       (users)       => set({ users }),
    setCurrentUser: (user)        => set({ currentUser: user }),
    setLoading:     (isLoading)   => set({ isLoading }),
    clearUser:      ()            => set({ currentUser: null }),
})));

export default useUserStore;