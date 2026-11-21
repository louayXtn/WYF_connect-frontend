'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  closeOpportunity,
  deleteOpportunity,
  fetchMyOpportunities,
  fetchOpportunity,
  respondToApplication,
  type Application,
  type Opportunity
} from '@/lib/opportunities-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function MyOpportunitiesView() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<(Opportunity & { applications: Application[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadOpportunities() {
    setLoading(true);
    try {
      const data = await fetchMyOpportunities();
      setOpportunities(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id: string) {
    try {
      const data = await fetchOpportunity(id);
      setSelectedDetail(data);
      setSelectedId(id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load applications');
    }
  }

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function handleRespond(applicationId: string, action: 'accept' | 'reject') {
    if (!selectedId) return;
    try {
      await respondToApplication(selectedId, applicationId, action);
      toast.success(`Application ${action}ed`);
      await loadDetail(selectedId);
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  }

  if (loading) return <p className='text-muted-foreground'>Loading...</p>;

  if (opportunities.length === 0) {
    return (
      <div className='rounded-xl border border-border/70 bg-card p-6 text-center shadow-sm'>
        <p className='text-muted-foreground'>You haven't posted any opportunities yet.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {opportunities.map((opp) => (
        <OpportunityCard
          key={opp._id}
          opp={opp}
          isSelected={selectedId === opp._id}
          selectedDetail={selectedId === opp._id ? selectedDetail : null}
          onViewApplications={() => loadDetail(opp._id)}
          onHide={() => setSelectedId(null)}
          onRespond={handleRespond}
          onUpdated={loadOpportunities}
        />
      ))}
    </div>
  );
}

function OpportunityCard({
  opp,
  isSelected,
  selectedDetail,
  onViewApplications,
  onHide,
  onRespond,
  onUpdated
}: {
  opp: Opportunity;
  isSelected: boolean;
  selectedDetail: (Opportunity & { applications: Application[] }) | null;
  onViewApplications: () => void;
  onHide: () => void;
  onRespond: (applicationId: string, action: 'accept' | 'reject') => void;
  onUpdated: () => void;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function handleDelete() {
    setProcessing(true);
    try {
      await deleteOpportunity(opp._id);
      toast.success('Opportunity deleted');
      setDeleteDialogOpen(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete opportunity');
    } finally {
      setProcessing(false);
    }
  }

  async function handleClose() {
    setProcessing(true);
    try {
      await closeOpportunity(opp._id);
      toast.success('Opportunity closed');
      setCloseDialogOpen(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to close opportunity');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold'>{opp.title}</h3>
          <Badge variant={opp.status === 'open' ? 'default' : 'secondary'}>{opp.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        {!isSelected ? (
          <Button variant='outline' size='sm' onClick={onViewApplications}>
            View Applications
          </Button>
        ) : (
          <div className='space-y-3'>
            {selectedDetail?.applications.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No applications yet.</p>
            ) : (
              selectedDetail?.applications.map((app) => (
                <div key={app._id} className='rounded-lg border border-border/70 p-3 text-sm'>
                  <div className='flex items-center justify-between'>
                    <p className='font-medium'>
                      {app.applicant.firstName} {app.applicant.lastName} — {app.project.title}
                    </p>
                    <Badge
                      variant={
                        app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'outline' : 'secondary'
                      }
                    >
                      {app.status}
                    </Badge>
                  </div>

                  {app.message && <p className='mt-1 text-muted-foreground'>{app.message}</p>}

                  <div className='mt-2 flex flex-wrap gap-2 text-xs'>
                    {app.pitchDeckUrl && (
                      <a href={app.pitchDeckUrl} target='_blank' rel='noopener noreferrer' className='underline'>
                        Pitch Deck
                      </a>
                    )}
                    {app.financialModelUrl && (
                      <a
                        href={app.financialModelUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='underline'
                      >
                        Financial Model
                      </a>
                    )}
                    {app.pitchVideoUrl && (
                      <a href={app.pitchVideoUrl} target='_blank' rel='noopener noreferrer' className='underline'>
                        Pitch Video
                      </a>
                    )}
                  </div>

                  {app.status === 'accepted' && (
                    <p className='mt-2 rounded-md bg-muted/50 p-2 text-xs'>
                      📧 Contact: <a href={`mailto:${app.applicant.email}`}>{app.applicant.email}</a>
                    </p>
                  )}

                  {app.status === 'pending' && (
                    <div className='mt-2 flex gap-2'>
                      <Button size='sm' onClick={() => onRespond(app._id, 'accept')}>
                        Accept
                      </Button>
                      <Button size='sm' variant='outline' onClick={() => onRespond(app._id, 'reject')}>
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
            <Button variant='ghost' size='sm' onClick={onHide}>
              Hide
            </Button>
          </div>
        )}

        {opp.status !== 'closed' && (
          <div className='flex gap-2 border-t border-border/70 pt-3'>
            <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
              <DialogTrigger
                render={
                  <Button variant='outline' size='sm'>
                    Close Opportunity
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Close this opportunity?</DialogTitle>
                </DialogHeader>
                <p className='text-sm text-muted-foreground'>
                  This opportunity will be archived and removed from public browsing. Accepted applicants will still
                  see their status.
                </p>
                <DialogFooter>
                  <Button variant='outline' onClick={() => setCloseDialogOpen(false)} disabled={processing}>
                    Cancel
                  </Button>
                  <Button onClick={handleClose} disabled={processing}>
                    {processing ? 'Closing...' : 'Close Opportunity'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger
                render={
                  <Button variant='destructive' size='sm'>
                    Delete Opportunity
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete this opportunity?</DialogTitle>
                </DialogHeader>
                <p className='text-sm text-muted-foreground'>
                  This will permanently delete the opportunity and all its applications. If it has accepted
                  applications, deletion will be blocked — close it instead. This cannot be undone.
                </p>
                <DialogFooter>
                  <Button variant='outline' onClick={() => setDeleteDialogOpen(false)} disabled={processing}>
                    Cancel
                  </Button>
                  <Button variant='destructive' onClick={handleDelete} disabled={processing}>
                    {processing ? 'Deleting...' : 'Delete Permanently'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}