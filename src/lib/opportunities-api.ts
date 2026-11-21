import { apiClient } from './api-client';
import { getToken } from './auth';

export interface RequiredDocuments {
  pitchDeck: boolean;
  financialModel: boolean;
  pitchVideo: boolean;
}

export interface Opportunity {
  _id: string;
  title: string;
  entityName: string;
  type: 'equity' | 'grant' | 'pre_seed' | 'incubation';
  description: string;
  fundingMin: number;
  fundingMax: number;
  targetStage: 'idea' | 'mvp' | 'startup';
  targetIndustries: string[];
  geographicScope: string[];
  requiredDocuments: RequiredDocuments;
  deadline?: string;
  status: 'open' | 'under_review' | 'closed';
  postedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

export interface Application {
  _id: string;
  applicant: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project: {
    _id: string;
    title: string;
    category: string;
  };
  message?: string;
  pitchDeckUrl?: string;
  financialModelUrl?: string;
  pitchVideoUrl?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface CreateOpportunityPayload {
  title: string;
  type: string;
  description: string;
  fundingMin: number;
  fundingMax: number;
  targetStage: string;
  targetIndustries: string[];
  geographicScope: string[];
  requiredDocuments: RequiredDocuments;
  deadline?: string;
}

export async function createOpportunity(payload: CreateOpportunityPayload) {
  return apiClient<Opportunity>('/opportunities', {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload)
  });
}

export async function fetchOpportunities(params?: { type?: string; status?: string }) {
  const query = new URLSearchParams();
  if (params?.type) query.set('type', params.type);
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return apiClient<Opportunity[]>(`/opportunities${qs ? `?${qs}` : ''}`);
}

export async function fetchOpportunity(id: string) {
  return apiClient<Opportunity & { applications: Application[] }>(`/opportunities/${id}`);
}

export async function fetchMyOpportunities() {
  return apiClient<Opportunity[]>('/opportunities/my', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export interface ApplyPayload {
  projectId: string;
  message?: string;
  pitchDeckUrl?: string;
  financialModelUrl?: string;
  pitchVideoUrl?: string;
}

export async function applyToOpportunity(opportunityId: string, payload: ApplyPayload) {
  return apiClient(`/opportunities/${opportunityId}/apply`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload)
  });
}

export async function respondToApplication(
  opportunityId: string,
  applicationId: string,
  action: 'accept' | 'reject'
) {
  return apiClient(`/opportunities/${opportunityId}/applications/${applicationId}/${action}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}
export interface MyApplication {
  _id: string;
  opportunityId: string;
  opportunityTitle: string;
  entityName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  contactEmail?: string;
}

export async function fetchMyApplications() {
  return apiClient<MyApplication[]>('/opportunities/applications/my', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}
export async function deleteOpportunity(opportunityId: string) {
  return apiClient(`/opportunities/${opportunityId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function closeOpportunity(opportunityId: string) {
  return apiClient(`/opportunities/${opportunityId}/close`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export async function fetchAllOpportunitiesAdmin(params?: { search?: string; status?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return apiClient<Opportunity[]>(`/opportunities/admin/all${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}