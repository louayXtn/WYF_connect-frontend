import { apiClient } from './api-client';
import { getToken } from './auth';

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  nationality: string;
  countryOfResidence: string;
  role: string;
  investorProfile?: {
    entityName?: string;
    targetIndustries?: string[];
  };
  verification: {
    status: string;
  };
}

export async function fetchMyProfile() {
  return apiClient<UserProfile>('/users/me', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  nationality?: string;
  countryOfResidence?: string;
  investorProfile?: {
    entityName?: string;
    targetIndustries?: string[];
  };
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  return apiClient<UserProfile>('/users/me', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload)
  });
}

export async function refreshToken() {
  return apiClient<{ token: string }>('/users/refresh-token', {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}