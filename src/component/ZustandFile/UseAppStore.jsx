import {create} from "zustand";

const UseAppStore = create((set) => ({
    isVerifiedRegion: false,
    setIsVerifiedRegion: (value) => set({ isVerifiedRegion: value }),
}));

export default UseAppStore;
