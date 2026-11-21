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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { uploadImageToImageKit } from '@/lib/imagekit-upload';
import {
  addExternalContribution,
  closeProject,
  deleteProject,
  fetchMyProjects,
  type Project
} from '@/lib/projects-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function MyProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    setLoading(true);
    try {
      const data = await fetchMyProjects();
      setProjects(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load your projects');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return <p className='text-muted-foreground'>Loading your projects...</p>;
  }

  if (projects.length === 0) {
    return (
      <div className='rounded-xl border border-border/70 bg-card p-6 text-center shadow-sm'>
        <p className='text-muted-foreground'>You haven't submitted any projects yet.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {projects.map((project) => (
        <MyProjectCard key={project._id} project={project} onUpdated={loadProjects} />
      ))}
    </div>
  );
}

function MyProjectCard({ project, onUpdated }: { project: Project; onUpdated: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [investorName, setInvestorName] = useState('');
  const [note, setNote] = useState('');
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const percentage = Math.min(Math.round((project.fundedAmount / project.goalAmount) * 100), 100);

  async function handleProofUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProof(true);
    try {
      const url = await uploadImageToImageKit(file);
      setProofUrl(url);
      toast.success('Proof uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingProof(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!investorName.trim()) {
      toast.error('Please enter the investor name');
      return;
    }

    setSubmitting(true);
    try {
      await addExternalContribution(project._id, {
        amount: Number(amount),
        investorName,
        note: note || undefined,
        proofUrl: proofUrl || undefined
      });
      toast.success('Contribution submitted for admin review!');
      setAmount('');
      setInvestorName('');
      setNote('');
      setProofUrl(null);
      setShowForm(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add contribution');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setProcessing(true);
    try {
      await deleteProject(project._id);
      toast.success('Project deleted');
      setDeleteDialogOpen(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete project');
    } finally {
      setProcessing(false);
    }
  }

  async function handleClose() {
    setProcessing(true);
    try {
      await closeProject(project._id);
      toast.success('Project closed');
      setCloseDialogOpen(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to close project');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='font-semibold'>{project.title}</h3>
            <p className='text-xs text-muted-foreground'>{project.category}</p>
          </div>
          <Badge variant={project.status === 'funded' ? 'default' : 'secondary'}>{project.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Progress value={percentage} />
          <div className='flex items-center justify-between text-sm'>
            <span className='font-semibold'>{percentage}% funded</span>
            <span className='text-muted-foreground'>
              ${project.fundedAmount.toLocaleString()} / ${project.goalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {!showForm ? (
          <Button variant='outline' size='sm' onClick={() => setShowForm(true)}>
            + Add off-platform funding
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-3 rounded-lg border border-border/70 p-3'>
            <p className='text-xs text-muted-foreground'>
              Record funding you received outside the platform (e.g. met an investor in person).
            </p>

            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <Label>Amount ($)</Label>
                <Input
                  type='number'
                  min='1'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
              <div className='space-y-1'>
                <Label>Investor Name</Label>
                <Input
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div className='space-y-1'>
              <Label>Note (optional)</Label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} disabled={submitting} rows={2} />
            </div>

            <div className='space-y-1'>
              <Label>Proof (optional)</Label>
              <Input
                type='file'
                accept='image/*'
                onChange={handleProofUpload}
                disabled={submitting || uploadingProof}
              />
              {uploadingProof && <p className='text-xs text-muted-foreground'>Uploading...</p>}
              {proofUrl && <img src={proofUrl} alt='Proof' className='h-20 rounded-md object-cover' />}
            </div>

            <div className='flex gap-2'>
              <Button type='submit' size='sm' disabled={submitting || uploadingProof}>
                {submitting ? 'Submitting...' : 'Add Funding'}
              </Button>
              <Button type='button' variant='ghost' size='sm' onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {project.status !== 'closed' && (
          <div className='flex gap-2 border-t border-border/70 pt-3'>
            <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
              <DialogTrigger
                render={
                  <Button variant='outline' size='sm'>
                    Close Project
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Close this project?</DialogTitle>
                </DialogHeader>
                <p className='text-sm text-muted-foreground'>
                  The project will be archived and removed from public browsing, but existing investors will still
                  see their records. You can't undo this from here.
                </p>
                <DialogFooter>
                  <Button variant='outline' onClick={() => setCloseDialogOpen(false)} disabled={processing}>
                    Cancel
                  </Button>
                  <Button onClick={handleClose} disabled={processing}>
                    {processing ? 'Closing...' : 'Close Project'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger
                render={
                  <Button variant='destructive' size='sm'>
                    Delete Project
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete this project?</DialogTitle>
                </DialogHeader>
                <p className='text-sm text-muted-foreground'>
                  This will permanently delete the project, its images, and all related data. If this project has
                  confirmed investments, deletion will be blocked — you'll need to close it instead. This cannot be
                  undone.
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