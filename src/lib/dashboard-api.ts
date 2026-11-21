import { apiClient } from './api-client';
import { getToken } from './auth';

export interface DashboardStats {
  platform: {
    totalFunding: number;
    totalProjects: number;
    totalUsers: number;
    newUsersChart: { month: string; youth: number; investor: number }[];
    fundingChart: { month: string; total: number }[];
  };
  personal: {
    totalProjects?: number;
    totalFunding?: number;
    totalInvestors?: number;
    totalInvestments?: number;
    totalInvested?: number;
    projectsBacked?: number;
    opportunitiesPosted?: number;
  };
  categoryPie: { category: string; count?: number; amount?: number }[];
  recentActivity: { label: string; detail: string; amount: number; createdAt: string }[];
  role: string;
}

export async function fetchDashboardStats() {
  return apiClient<DashboardStats>('/dashboard/stats', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}