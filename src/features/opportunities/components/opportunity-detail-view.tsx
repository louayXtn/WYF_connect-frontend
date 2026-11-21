'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getCurrentUser } from '@/lib/auth';
import { uploadFileToImageKit } from '@/lib/imagekit-upload';
import {
  applyToOpportunity,
  fetchOpportunity,
  type Application,
  type Opportunity
} from '@/lib/opportunities-api';
import { fetchMyProjects, type Project } from '@/lib/projects-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const TYPE_LABELS: Record<string, string> = {
  equity: 'Equity Financing',
  grant: 'Non-dilutive Grant',
  pre_seed: 'Pre-seed / Accelerator',
  incubation: 'Incubation / Acceleration'
};

const STAGE_LABELS: Record<string, string> = {
  idea: 'Idea Stage',
  mvp: 'MVP',
  startup: 'Startup'
};

export default function OpportunityDetailView({ opportunityId }: { opportunityId: string }) {
  const [opportunity, setOpportunity] = useState<(Opportunity & { applications: Application[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();
  const isYouth = currentUser?.role === 'youth';

  async function loadOpportunity() {
    try {
      const data = await fetchOpportunity(opportunityId);
      setOpportunity(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load opportunity');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOpportunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunityId]);

  if (loading) {
    return <p className='p-6 text-muted-foreground'>Loading opportunity...</p>;
  }

  if (!opportunity) {
    return <p className='p-6 text-muted-foreground'>Opportunity not found.</p>;
  }

  const myApplication = opportunity.applications.find((a) => a.applicant._id === currentUser?.id);

  return (
    <div className='mx-auto max-w-3xl space-y-6 p-4'>
      <div className='space-y-2'>
        <Badge variant='outline'>{TYPE_LABELS[opportunity.type] || opportunity.type}</Badge>
        <h1 className='text-2xl font-bold'>{opportunity.title}</h1>
        <p className='text-sm text-muted-foreground'>Posted by {opportunity.entityName}</p>
      </div>

      <p className='text-sm leading-relaxed'>{opportunity.description}</p>

      <Card>
        <CardContent className='grid grid-cols-2 gap-4 pt-6 text-sm'>
          <div>
            <p className='text-muted-foreground'>Funding Range</p>
            <p className='font-medium'>
              ${opportunity.fundingMin.toLocaleString()} - ${opportunity.fundingMax.toLocaleString()}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground'>Target Stage</p>
            <p className='font-medium'>{STAGE_LABELS[opportunity.targetStage] || opportunity.targetStage}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Geographic Scope</p>
            <p className='font-medium'>
              {opportunity.geographicScope.length > 0 ? opportunity.geographicScope.join(', ') : 'International'}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground'>Deadline</p>
            <p className='font-medium'>
              {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'No deadline'}
            </p>
          </div>
        </CardContent>
      </Card>

      {opportunity.targetIndustries.length > 0 && (
        <div className='space-y-2'>
          <p className='text-sm font-medium'>Target Industries</p>
          <div className='flex flex-wrap gap-1.5'>
            {opportunity.targetIndustries.map((ind) => (
              <Badge key={ind} variant='secondary'>
                {ind}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <h3 className='font-semibold'>Required Documents</h3>
        </CardHeader>
        <CardContent>
          <ul className='space-y-1 text-sm'>
            <li>{opportunity.requiredDocuments.pitchDeck ? '✓' : '—'} Pitch Deck</li>
            <li>{opportunity.requiredDocuments.financialModel ? '✓' : '—'} Financial Model</li>
            <li>{opportunity.requiredDocuments.pitchVideo ? '✓' : '—'} Pitch Video</li>
          </ul>
        </CardContent>
      </Card>

      {isYouth && opportunity.status === 'open' && (
        <>
          {myApplication ? (
            <div className='rounded-lg border border-border/70 bg-muted/30 p-4 text-sm'>
              You already applied to this opportunity —{' '}
              <Badge
                variant={
                  myApplication.status === 'accepted'
                    ? 'default'
                    : myApplication.status === 'rejected'
                      ? 'outline'
                      : 'secondary'
                }
              >
                {myApplication.status}
              </Badge>
            </div>
          ) : (
            <ApplyForm opportunity={opportunity} onApplied={loadOpportunity} />
          )}
        </>
      )}
    </div>
  );
}

function ApplyForm({ opportunity, onApplied }: { opportunity: Opportunity; onApplied: () => void }) {
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState('');
  const [message, setMessage] = useState('');

  const [pitchDeckUrl, setPitchDeckUrl] = useState<string | null>(null);
  const [financialModelUrl, setFinancialModelUrl] = useState<string | null>(null);
  const [pitchVideoUrl, setPitchVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMyProjects()
      .then(setMyProjects)
      .catch(() => toast.error('Failed to load your projects'));
  }, []);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
    label: string
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(label);
    try {
      const url = await uploadFileToImageKit(file, '/wyf-opportunities');
      setter(url);
      toast.success(`${label} uploaded`);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!projectId) {
      toast.error('Please select a project');
      return;
    }
    if (opportunity.requiredDocuments.pitchDeck && !pitchDeckUrl) {
      toast.error('Pitch deck is required for this opportunity');
      return;
    }
    if (opportunity.requiredDocuments.financialModel && !financialModelUrl) {
      toast.error('Financial model is required for this opportunity');
      return;
    }
    if (opportunity.requiredDocuments.pitchVideo && !pitchVideoUrl) {
      toast.error('Pitch video is required for this opportunity');
      return;
    }

    setSubmitting(true);
    try {
      await applyToOpportunity(opportunity._id, {
        projectId,
        message: message || undefined,
        pitchDeckUrl: pitchDeckUrl || undefined,
        financialModelUrl: financialModelUrl || undefined,
        pitchVideoUrl: pitchVideoUrl || undefined
      });
      toast.success('Application submitted!');
      onApplied();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h3 className='font-semibold'>Apply to this Opportunity</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label>Select Project</Label>
            <Select value={projectId} onValueChange={(v) => setProjectId(v ?? '')} disabled={submitting}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Choose one of your projects'>
  {myProjects.find((p) => p._id === projectId)?.title}
</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {myProjects.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Message (optional)</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} disabled={submitting} rows={3} />
          </div>

          {opportunity.requiredDocuments.pitchDeck && (
            <div className='space-y-2'>
              <Label>Pitch Deck (PDF)</Label>
              <Input
                type='file'
                accept='application/pdf'
                onChange={(e) => handleUpload(e, setPitchDeckUrl, 'Pitch Deck')}
                disabled={submitting || uploading !== null}
              />
              {pitchDeckUrl && <p className='text-xs text-muted-foreground'>✓ Uploaded</p>}
            </div>
          )}

          {opportunity.requiredDocuments.financialModel && (
            <div className='space-y-2'>
              <Label>Financial Model (PDF)</Label>
              <Input
                type='file'
                accept='application/pdf'
                onChange={(e) => handleUpload(e, setFinancialModelUrl, 'Financial Model')}
                disabled={submitting || uploading !== null}
              />
              {financialModelUrl && <p className='text-xs text-muted-foreground'>✓ Uploaded</p>}
            </div>
          )}

          {opportunity.requiredDocuments.pitchVideo && (
            <div className='space-y-2'>
              <Label>Pitch Video</Label>
              <Input
                type='file'
                accept='video/*'
                onChange={(e) => handleUpload(e, setPitchVideoUrl, 'Pitch Video')}
                disabled={submitting || uploading !== null}
              />
              {pitchVideoUrl && <p className='text-xs text-muted-foreground'>✓ Uploaded</p>}
            </div>
          )}

          <Button type='submit' disabled={submitting || uploading !== null} className='w-full'>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}