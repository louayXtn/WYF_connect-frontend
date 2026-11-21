import { apiClient } from './api-client';
import { getToken } from './auth';

export interface VerificationPayload {
  idCardFrontUrl: string;
  idCardBackUrl: string;
  selfieWithIdUrl: string;
  phoneNumber: string;
}

export interface VerificationStatus {
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  idCardFrontUrl?: string;
  idCardBackUrl?: string;
  selfieWithIdUrl?: string;
  rejectionReason?: string;
  submittedAt?: string;
  verifiedAt?: string;
}

export async function submitVerification(payload: VerificationPayload) {
  return apiClient<{ message: string; verification: VerificationStatus }>('/verification/submit', {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload)
  });
}

export async function fetchVerificationStatus() {
  return apiClient<VerificationStatus>('/verification/status', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}
export interface PendingVerificationUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  verification: VerificationStatus;
}

export async function fetchPendingVerifications() {
  return apiClient<PendingVerificationUser[]>('/verification/pending', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function approveVerification(userId: string) {
  return apiClient(`/verification/${userId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function rejectVerification(userId: string, reason: string) {
  return apiClient(`/verification/${userId}/reject`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ reason })
  });
}