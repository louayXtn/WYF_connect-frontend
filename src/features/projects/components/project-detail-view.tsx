'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { getCurrentUser } from '@/lib/auth';
import { uploadImageToImageKit } from '@/lib/imagekit-upload';
import {
  addComment,
  fetchProject,
  fetchProjectInvestments,
  investInProject,
  type Comment,
  type Investment,
  type Project
} from '@/lib/projects-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { VerifiedBadge } from '@/components/verified-badge';
import {
  fetchConfidentialInfo,
  fetchNdaStatus,
  requestNdaAccess,
  type ConfidentialInfo
} from '@/lib/projects-api';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
export default function ProjectDetailView({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<(Project & { comments: Comment[] }) | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  const [investAmount, setInvestAmount] = useState('');
  const [investNote, setInvestNote] = useState('');
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [investing, setInvesting] = useState(false);

  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);

  const currentUser = getCurrentUser();
  const [ndaStatus, setNdaStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
const [confidentialInfo, setConfidentialInfo] = useState<ConfidentialInfo | null>(null);
const [requestingNda, setRequestingNda] = useState(false);
  async function loadData() {
    setLoading(true);
    try {
      const [projectData, investmentsData] = await Promise.all([
        fetchProject(projectId),
        fetchProjectInvestments(projectId)
      ]);
      setProject(projectData);
      setInvestments(investmentsData);
      
    } catch (err: any) {
      toast.error(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }
  async function handleRequestNda() {
  setRequestingNda(true);
  try {
    await requestNdaAccess(projectId);
    toast.success('NDA request sent!');
    setNdaStatus('pending');
  } catch (err: any) {
    toast.error(err.message || 'Failed to send request');
  } finally {
    setRequestingNda(false);
  }
}
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);
  useEffect(() => {
  if (!currentUser || currentUser.role !== 'investor') return;
  fetchNdaStatus(projectId)
    .then((res) => {
      setNdaStatus(res.status);
      if (res.status === 'approved') {
        fetchConfidentialInfo(projectId).then(setConfidentialInfo).catch(() => {});
      }
    })
    .catch(() => {});
}, [projectId]);
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

  async function handleInvest(e: React.FormEvent) {
    e.preventDefault();

    if (!investAmount || Number(investAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!proofUrl) {
      toast.error('Please upload proof of transfer before submitting');
      return;
    }

    setInvesting(true);
    try {
      await investInProject(projectId, Number(investAmount), proofUrl, investNote || undefined);
      toast.success('Investment submitted for admin review!');
      setInvestAmount('');
      setInvestNote('');
      setProofUrl(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Investment failed');
    } finally {
      setInvesting(false);
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommenting(true);
    try {
      const updatedComments = await addComment(projectId, commentText);
      setProject((prev) => (prev ? { ...prev, comments: updatedComments } : prev));
      setCommentText('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add comment');
    } finally {
      setCommenting(false);
    }
  }

  if (loading) {
    return <p className='p-6 text-muted-foreground'>Loading project...</p>;
  }

  if (!project) {
    return <p className='p-6 text-muted-foreground'>Project not found.</p>;
  }

  const percentage = Math.min(Math.round((project.fundedAmount / project.goalAmount) * 100), 100);
  const isOwner = currentUser?.id === project.owner._id;
  const isInvestor = currentUser?.role === 'investor';

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      {project.images.length > 0 && (
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
          {project.images.map((url) => (
            <img key={url} src={url} alt={project.title} className='h-40 w-full rounded-lg object-cover' />
          ))}
        </div>
      )}

      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Badge variant='outline'>{project.category}</Badge>
          <Badge variant={project.status === 'funded' ? 'default' : 'secondary'}>{project.status}</Badge>
        </div>
        <h1 className='text-2xl font-bold'>{project.title}</h1>
        <p className='flex items-center gap-1 text-sm text-muted-foreground'>
  By {project.owner.firstName} {project.owner.lastName}
  {project.owner.verification?.status === 'verified' && (
  <span className='inline-flex items-center gap-1'>
    <VerifiedBadge /> <span className='text-xs'>Verified</span>
  </span>
)}
</p>
      </div>

      <p className='text-sm leading-relaxed'>{project.description}</p>

      <Card>
        <CardContent className='space-y-3 pt-6'>
          <Progress value={percentage} />
          <div className='flex items-center justify-between text-sm'>
            <span className='font-semibold'>{percentage}% funded</span>
            <span className='text-muted-foreground'>
              ${project.fundedAmount.toLocaleString()} / ${project.goalAmount.toLocaleString()}
            </span>
          </div>
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>Total project cost: ${project.totalCost.toLocaleString()}</span>
            <span>
              {project.investorsCount} investor{project.investorsCount !== 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {!isOwner && currentUser && isInvestor && (
        <Card>
          <CardHeader>
            <h3 className='font-semibold'>Invest in this project</h3>
            <p className='text-xs text-muted-foreground'>
              Every investment requires proof of transfer and is reviewed by our team before being added to the
              project.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvest} className='space-y-3'>
              <Input
                type='number'
                min='1'
                placeholder='Amount ($)'
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                disabled={investing}
                required
              />
              <Textarea
                placeholder='Note (optional)'
                value={investNote}
                onChange={(e) => setInvestNote(e.target.value)}
                disabled={investing}
                rows={2}
              />

              <div className='space-y-2'>
                <Label>Proof of Transfer (required)</Label>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={handleProofUpload}
                  disabled={investing || uploadingProof}
                />
                {uploadingProof && <p className='text-xs text-muted-foreground'>Uploading...</p>}
                {proofUrl && (
                  <img src={proofUrl} alt='Proof of transfer' className='h-24 rounded-md object-cover' />
                )}
              </div>

              <Button type='submit' disabled={investing || uploadingProof}>
                {investing ? 'Submitting...' : 'Submit Investment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {!isOwner && currentUser && !isInvestor && (
        <div className='rounded-lg border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground'>
          Only investor accounts can invest in projects.
        </div>
      )}
      {!isOwner && isInvestor && (
  <Card>
    <CardHeader>
      <h3 className='font-semibold'>Confidential Information</h3>
    </CardHeader>
    <CardContent className='space-y-3'>
      {ndaStatus === 'none' && (
        <>
          <p className='text-sm text-muted-foreground'>
            Request access to confidential details (financial plan, technical/IP documents) from the founder.
          </p>
          <Dialog>
  <DialogTrigger
    render={
      <Button  size='sm' disabled={requestingNda}>
        {requestingNda ? 'Sending...' : 'Request NDA Access'}
      </Button>
    }
  />
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm NDA Request</DialogTitle>
    </DialogHeader>
    <p className='text-sm text-muted-foreground'>
      You're about to request confidential access to this project. The founder will review your request and can
      approve or decline it. Do you want to proceed?
    </p>
    <DialogFooter showCloseButton>
      <DialogClose render={<Button onClick={handleRequestNda} disabled={requestingNda} />}>
        {requestingNda ? 'Sending...' : 'Confirm Request'}
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
        </>
      )}

      {ndaStatus === 'pending' && (
        <Badge variant='secondary'>NDA request pending founder approval</Badge>
      )}

      {ndaStatus === 'rejected' && <Badge variant='outline'>NDA request declined</Badge>}

      {ndaStatus === 'approved' && confidentialInfo && (
        <div className='space-y-2 text-sm'>
          <Badge>✓ NDA Approved</Badge>
          {confidentialInfo.financialPlanUrl && (
            <p>
              <a href={confidentialInfo.financialPlanUrl} target='_blank' rel='noopener noreferrer' className='underline'>
                📄 Financial Plan
              </a>
            </p>
          )}
          {confidentialInfo.technicalDetailsUrl && (
            <p>
              <a
                href={confidentialInfo.technicalDetailsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='underline'
              >
                📄 Technical / IP Details
              </a>
            </p>
          )}
          {confidentialInfo.additionalNotes && <p className='text-muted-foreground'>{confidentialInfo.additionalNotes}</p>}
          {!confidentialInfo.financialPlanUrl &&
            !confidentialInfo.technicalDetailsUrl &&
            !confidentialInfo.additionalNotes && (
              <p className='text-muted-foreground'>The founder hasn't uploaded confidential details yet.</p>
            )}
        </div>
      )}
    </CardContent>
  </Card>
)}

      <Card>
        <CardHeader>
          <h3 className='font-semibold'>Funding History</h3>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No confirmed contributions yet.</p>
          ) : (
            <ul className='space-y-3'>
              {investments.map((inv) => (
                <li key={inv._id} className='flex items-center justify-between border-b pb-2 text-sm last:border-0'>
  <div>
    <p className='flex items-center gap-1 font-medium'>
      {inv.investorName} {inv.investorVerified && <VerifiedBadge />} — ${inv.amount.toLocaleString()}
    </p>
    {inv.note && <p className='text-muted-foreground'>{inv.note}</p>}
  </div>
  <Badge variant={inv.source === 'platform' ? 'default' : 'outline'}>
    {inv.source === 'platform' ? 'Via platform' : 'Off-platform'}
  </Badge>
</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className='font-semibold'>Comments</h3>
        </CardHeader>
        <CardContent className='space-y-4'>
          {currentUser && (
            <form onSubmit={handleComment} className='flex gap-2'>
              <Input
                placeholder='Add a comment...'
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={commenting}
              />
              <Button type='submit' disabled={commenting}>
                Post
              </Button>
            </form>
          )}

          {project.comments.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No comments yet.</p>
          ) : (
            <ul className='space-y-3'>
              {project.comments.map((c) => (
                <li key={c._id} className='border-b pb-2 text-sm last:border-0'>
  <p className='flex items-center gap-1 font-medium'>
    {c.author.firstName} {c.author.lastName}
    {c.author.verification?.status === 'verified' && <VerifiedBadge />}
  </p>
  <p className='text-muted-foreground'>{c.text}</p>
</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}