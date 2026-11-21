'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getCurrentUser } from '@/lib/auth';
import {
  approveInvestment,
  fetchPendingInvestments,
  rejectInvestment,
  type PendingInvestment
} from '@/lib/projects-api';
import {
  approveVerification,
  fetchPendingVerifications,
  rejectVerification,
  type PendingVerificationUser
} from '@/lib/verification-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const currentUser = getCurrentUser();

  const [verifications, setVerifications] = useState<PendingVerificationUser[]>([]);
  const [investments, setInvestments] = useState<PendingInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [verificationsData, investmentsData] = await Promise.all([
        fetchPendingVerifications(),
        fetchPendingInvestments()
      ]);
      setVerifications(verificationsData);
      setInvestments(investmentsData);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleApproveVerification(userId: string) {
    try {
      await approveVerification(userId);
      toast.success('User verified');
      setVerifications((prev) => prev.filter((u) => u._id !== userId));
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  }

  async function handleRejectVerification(userId: string) {
    try {
      await rejectVerification(userId, 'Documents unclear or invalid');
      toast.success('Verification rejected');
      setVerifications((prev) => prev.filter((u) => u._id !== userId));
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  }

  async function handleApproveInvestment(investmentId: string) {
    try {
      await approveInvestment(investmentId);
      toast.success('Investment approved');
      setInvestments((prev) => prev.filter((i) => i._id !== investmentId));
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  }

  async function handleRejectInvestment(investmentId: string) {
    try {
      await rejectInvestment(investmentId);
      toast.success('Investment rejected');
      setInvestments((prev) => prev.filter((i) => i._id !== investmentId));
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className='rounded-xl border border-border/70 bg-card p-6 text-center shadow-sm'>
        <p className='text-muted-foreground'>You do not have access to this page.</p>
      </div>
    );
  }

  if (loading) {
    return <p className='text-muted-foreground'>Loading...</p>;
  }

  return (
    <Tabs defaultValue='verifications' className='space-y-4'>
      <TabsList>
        <TabsTrigger value='verifications'>
          Identity Verifications
          {verifications.length > 0 && (
            <Badge variant='secondary' className='ml-2'>
              {verifications.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value='investments'>
          Pending Investments
          {investments.length > 0 && (
            <Badge variant='secondary' className='ml-2'>
              {investments.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value='verifications' className='space-y-4'>
        {verifications.length === 0 ? (
          <p className='text-muted-foreground'>No pending verification requests.</p>
        ) : (
          verifications.map((user) => (
            <Card key={user._id}>
              <CardHeader>
                <h3 className='font-semibold'>
                  {user.firstName} {user.lastName}
                </h3>
                <p className='text-sm text-muted-foreground'>{user.email}</p>
<p className='text-sm text-muted-foreground'>Num: {user.phoneNumber}</p>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-3 gap-3'>
  <ZoomableImage src={user.verification.idCardFrontUrl} alt='ID front' label='ID Front' />
  <ZoomableImage src={user.verification.idCardBackUrl} alt='ID back' label='ID Back' />
  <ZoomableImage src={user.verification.selfieWithIdUrl} alt='Selfie with ID' label='Selfie with ID' />
</div>
                <div className='flex gap-2'>
                  <Button onClick={() => handleApproveVerification(user._id)}>Approve</Button>
                  <Button variant='outline' onClick={() => handleRejectVerification(user._id)}>
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value='investments' className='space-y-4'>
        {investments.length === 0 ? (
          <p className='text-muted-foreground'>No pending investments.</p>
        ) : (
          investments.map((inv) => (
            <Card key={inv._id}>
              <CardHeader>
  <h3 className='font-semibold'>
    {inv.investor ? `${inv.investor.firstName} ${inv.investor.lastName}` : inv.investorName || 'Anonymous'} →{' '}
    {inv.project.title}
  </h3>
  <p className='text-sm text-muted-foreground'>
    {inv.investor ? inv.investor.email : 'Off-platform contribution'} — ${inv.amount.toLocaleString()}
  </p>
</CardHeader>
              <CardContent className='space-y-4'>
                {inv.note && <p className='text-sm text-muted-foreground'>Note: {inv.note}</p>}
                {inv.proofUrl && (
                  <div>
                    <p className='mb-1 text-xs text-muted-foreground'>Proof of transfer</p>
                    <img src={inv.proofUrl} alt='Proof' className='h-40 rounded-md object-cover' />
                  </div>
                )}
                <div className='flex gap-2'>
                  <Button onClick={() => handleApproveInvestment(inv._id)}>Approve</Button>
                  <Button variant='outline' onClick={() => handleRejectInvestment(inv._id)}>
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
function ZoomableImage({ src, alt, label }: { src?: string; alt: string; label: string }) {
  if (!src) return null;

  return (
    <div>
      <p className='mb-1 text-xs text-muted-foreground'>{label}</p>
      <Dialog>
        <DialogTrigger
          render={
            <img
              src={src}
              alt={alt}
              className='h-32 w-full cursor-zoom-in rounded-md object-cover transition-opacity hover:opacity-80'
            />
          }
        />
        <DialogContent className='max-w-3xl'>
          <img src={src} alt={alt} className='h-auto w-full rounded-md object-contain' />
        </DialogContent>
      </Dialog>
    </div>
  );
}