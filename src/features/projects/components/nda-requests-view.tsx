'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { VerifiedBadge } from '@/components/verified-badge';
import {
  fetchIncomingNdaRequests,
  respondToNdaRequest,
  type NdaRequest
} from '@/lib/projects-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function NdaRequestsView() {
  const [requests, setRequests] = useState<NdaRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    setLoading(true);
    try {
      const data = await fetchIncomingNdaRequests();
      setRequests(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load NDA requests');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleRespond(requestId: string, action: 'approve' | 'reject') {
    try {
      await respondToNdaRequest(requestId, action);
      toast.success(`Request ${action}d`);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  }

  if (loading) return <p className='text-muted-foreground'>Loading...</p>;

  if (requests.length === 0) {
    return (
      <div className='rounded-xl border border-border/70 bg-card p-6 text-center shadow-sm'>
        <p className='text-muted-foreground'>No pending NDA requests.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {requests.map((req) => (
        <Card key={req._id}>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='flex items-center gap-1 font-semibold'>
                {req.requester.firstName} {req.requester.lastName}
                {req.requester.verification?.status === 'verified' && <VerifiedBadge />}
              </h3>
              <Badge variant='secondary'>{req.status}</Badge>
            </div>
            <p className='text-xs text-muted-foreground'>
              {req.requester.email} — requesting access to <span className='font-medium'>{req.project.title}</span>
            </p>
          </CardHeader>
          <CardContent className='space-y-3'>
            {req.message && <p className='text-sm text-muted-foreground'>{req.message}</p>}
            <div className='flex gap-2'>
              <Button size='sm' onClick={() => handleRespond(req._id, 'approve')}>
                Approve
              </Button>
              <Button size='sm' variant='outline' onClick={() => handleRespond(req._id, 'reject')}>
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}