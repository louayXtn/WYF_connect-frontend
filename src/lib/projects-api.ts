import { apiClient } from './api-client';
import { getToken } from './auth';

export interface CreateProjectPayload {
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  totalCost: number;
  images: string[];
  confidentialInfo?: ConfidentialInfo;
}

export async function createProject(payload: CreateProjectPayload) {
  return apiClient('/projects', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(payload)
  });
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  goalAmount: number;
  totalCost: number;
  fundedAmount: number;
  owner: {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  verification?: {
    status: 'unverified' | 'pending' | 'verified' | 'rejected';
  };
};
  investorsCount: number;
  status: string;
  createdAt: string;
}

export interface ProjectsResponse {
  total: number;
  page: number;
  limit: number;
  projects: Project[];
}

export async function fetchProjects(params?: { search?: string; category?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category) query.set('category', params.category);

  const queryString = query.toString();
  return apiClient<ProjectsResponse>(`/projects${queryString ? `?${queryString}` : ''}`);
}
export interface Comment {
  _id: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    verification?: { status: string };
  };
  text: string;
  createdAt: string;
}

export interface Investment {
  _id: string;
  amount: number;
  note?: string;
  source: 'platform' | 'external';
  proofUrl?: string | null;
  investorName: string;
  investorVerified?: boolean;
  createdAt: string;
}

export async function fetchProject(id: string) {
  return apiClient<Project & { comments: Comment[] }>(`/projects/${id}`);
}

export async function fetchProjectInvestments(id: string) {
  return apiClient<Investment[]>(`/projects/${id}/investments`);
}

export async function investInProject(id: string, amount: number, proofUrl: string, note?: string) {
  return apiClient(`/projects/${id}/invest`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ amount, proofUrl, note })
  });
}

export async function addComment(id: string, text: string) {
  return apiClient<Comment[]>(`/projects/${id}/comments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ text })
  });
}
export interface PendingInvestment {
  _id: string;
  amount: number;
  note?: string;
  proofUrl?: string;
  investorName?: string;
  createdAt: string;
  investor?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project: {
    _id: string;
    title: string;
  };
}

export async function fetchPendingInvestments() {
  return apiClient<PendingInvestment[]>('/projects/admin/pending-investments', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function approveInvestment(investmentId: string) {
  return apiClient(`/projects/admin/investments/${investmentId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function rejectInvestment(investmentId: string) {
  return apiClient(`/projects/admin/investments/${investmentId}/reject`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function fetchMyProjects() {
  return apiClient<Project[]>('/projects/my', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export interface ExternalContributionPayload {
  amount: number;
  investorName: string;
  note?: string;
  proofUrl?: string;
}

export async function addExternalContribution(projectId: string, payload: ExternalContributionPayload) {
  return apiClient(`/projects/${projectId}/external-contribution`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload)
  });
}
export interface ConfidentialInfo {
  financialPlanUrl?: string;
  technicalDetailsUrl?: string;
  additionalNotes?: string;
}

export interface NdaRequest {
  _id: string;
  project: { _id: string; title: string };
  requester: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    verification?: { status: string };
  };
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export async function requestNdaAccess(projectId: string, message?: string) {
  return apiClient(`/projects/${projectId}/nda-request`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ message })
  });
}

export async function fetchNdaStatus(projectId: string) {
  return apiClient<{ status: 'none' | 'pending' | 'approved' | 'rejected' }>(`/projects/${projectId}/nda-status`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function fetchConfidentialInfo(projectId: string) {
  return apiClient<ConfidentialInfo>(`/projects/${projectId}/confidential`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function fetchIncomingNdaRequests() {
  return apiClient<NdaRequest[]>('/projects/nda/incoming', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function respondToNdaRequest(requestId: string, action: 'approve' | 'reject') {
  return apiClient(`/projects/nda/${requestId}/${action}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function deleteProject(projectId: string) {
  return apiClient(`/projects/${projectId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function closeProject(projectId: string) {
  return apiClient(`/projects/${projectId}/close`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function fetchAllProjectsAdmin(params?: { search?: string; status?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return apiClient<Project[]>(`/projects/admin/all${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}