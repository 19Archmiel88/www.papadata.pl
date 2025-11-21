import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrganizationProfile, Integration, Schedule } from '../../types';

/**
 * Simple zustand store for persisting onboarding state across the multi‑step
 * wizard. State is persisted to localStorage to survive page refreshes. Each
 * step updates its portion of the state via the provided setter functions.
 */
interface OnboardingState {
  profile: Partial<OrganizationProfile>;
  integrations: Integration[];
  connections: Record<string, any>;
  schedule: Partial<Schedule>;
  setProfile: (data: Partial<OrganizationProfile>) => void;
  setIntegrations: (data: Integration[]) => void;
  setConnections: (data: Record<string, any>) => void;
  setSchedule: (data: Partial<Schedule>) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      profile: {},
      integrations: [],
      connections: {},
      schedule: {},
      setProfile: (data) => set({ profile: data }),
      setIntegrations: (data) => set({ integrations: data }),
      setConnections: (data) => set({ connections: data }),
      setSchedule: (data) => set({ schedule: data }),
    }),
    { name: 'onboarding-store' }
  )
);