import { create } from 'zustand';

export type UserType = 'user' | 'business' | null;
export type VerificationStatus = 'unverified' | 'pending' | 'verified';

interface UserStore {
  userType: UserType;
  setUserType: (type: UserType) => void;
  verificationStatus: VerificationStatus;
  setVerificationStatus: (status: VerificationStatus) => void;
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
  verificationStatus: 'unverified',
  setVerificationStatus: (status) => set({ verificationStatus: status }),
  businessProfile: undefined,
  setBusinessProfile: (profile) => set({ businessProfile: profile }),
}));
