import { create } from 'zustand';

export type UserType = 'user' | 'business' | null;

interface UserStore {
  userType: UserType;
  setUserType: (type: UserType) => void;
  businessProfile?: {
    name: string;
    type: string;
    location: string;
    id: string;
  };
  setBusinessProfile: (profile: any) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userType: null,
  setUserType: (type) => set({ userType: type }),
  businessProfile: undefined,
  setBusinessProfile: (profile) => set({ businessProfile: profile }),
}));