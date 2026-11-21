'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { uploadImageToImageKit } from '@/lib/imagekit-upload';
import { fetchVerificationStatus, submitVerification, type VerificationStatus } from '@/lib/verification-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function VerifyIdentityForm() {
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [idCardFront, setIdCardFront] = useState<string | null>(null);
  const [idCardBack, setIdCardBack] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [uploading, setUploading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadStatus() {
    setLoadingStatus(true);
    try {
      const data = await fetchVerificationStatus();
      setStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStatus(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
    label: string
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(label);
    try {
      const url = await uploadImageToImageKit(file);
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

    if (!idCardFront || !idCardBack || !selfie || !phoneNumber) {
      toast.error('Please complete all fields before submitting');
      return;
    }

    setSubmitting(true);
    try {
      await submitVerification({
        idCardFrontUrl: idCardFront,
        idCardBackUrl: idCardBack,
        selfieWithIdUrl: selfie,
        phoneNumber
      });
      toast.success('Verification request submitted! We will review it soon.');
      await loadStatus();
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingStatus) {
    return <p className='text-muted-foreground'>Loading...</p>;
  }

  // Already verified
  if (status?.status === 'verified') {
    return (
      <div className='space-y-2 text-center'>
        <Badge>✓ Verified</Badge>
        <p className='text-muted-foreground text-sm'>Your identity has been verified. You're all set!</p>
      </div>
    );
  }

  // Pending review
  if (status?.status === 'pending') {
    return (
      <div className='space-y-2 text-center'>
        <Badge variant='secondary'>Pending Review</Badge>
        <p className='text-muted-foreground text-sm'>
          Your verification request is under review. This usually takes 1-2 business days.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {status?.status === 'rejected' && status.rejectionReason && (
        <div className='rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive'>
          Your previous request was rejected: {status.rejectionReason}. Please submit again with corrected
          information.
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-5'>
        <div className='space-y-2'>
          <Label>ID Card — Front Side</Label>
          <Input
            type='file'
            accept='image/*'
            onChange={(e) => handleFileUpload(e, setIdCardFront, 'ID front')}
            disabled={uploading !== null || submitting}
          />
          {idCardFront && <img src={idCardFront} alt='ID front' className='h-32 rounded-md object-cover' />}
        </div>

        <div className='space-y-2'>
          <Label>ID Card — Back Side</Label>
          <Input
            type='file'
            accept='image/*'
            onChange={(e) => handleFileUpload(e, setIdCardBack, 'ID back')}
            disabled={uploading !== null || submitting}
          />
          {idCardBack && <img src={idCardBack} alt='ID back' className='h-32 rounded-md object-cover' />}
        </div>

        <div className='space-y-2'>
          <Label>Selfie Holding Your ID</Label>
          <Input
            type='file'
            accept='image/*'
            onChange={(e) => handleFileUpload(e, setSelfie, 'Selfie')}
            disabled={uploading !== null || submitting}
          />
          {selfie && <img src={selfie} alt='Selfie with ID' className='h-32 rounded-md object-cover' />}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phoneNumber'>Phone Number</Label>
          <Input
            id='phoneNumber'
            type='tel'
            placeholder='+216 94123456'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={submitting}
            required
          />
        </div>

        <Button type='submit' disabled={submitting || uploading !== null} className='w-full'>
          {submitting ? 'Submitting...' : 'Submit for Verification'}
        </Button>
      </form>
    </div>
  );
}