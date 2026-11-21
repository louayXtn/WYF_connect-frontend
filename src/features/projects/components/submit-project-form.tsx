'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { createProject } from '@/lib/projects-api';
import { uploadImageToImageKit } from '@/lib/imagekit-upload';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Technology',
  'Agriculture',
  'Fintech',
  'Health',
  'Education',
  'E-commerce',
  'Sustainability',
  'Other'
];

export default function SubmitProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [financialPlanUrl, setFinancialPlanUrl] = useState<string | null>(null);
const [technicalDetailsUrl, setTechnicalDetailsUrl] = useState<string | null>(null);
const [additionalNotes, setAdditionalNotes] = useState('');
const [uploadingConfidential, setUploadingConfidential] = useState<string | null>(null);
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImageToImageKit(file);
        uploadedUrls.push(url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }
async function handleConfidentialUpload(
  e: React.ChangeEvent<HTMLInputElement>,
  setter: (url: string) => void,
  label: string
) {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploadingConfidential(label);
  try {
    const url = await uploadImageToImageKit(file);
    setter(url);
    toast.success(`${label} uploaded`);
  } catch (err: any) {
    toast.error(err.message || 'Upload failed');
  } finally {
    setUploadingConfidential(null);
  }
}
  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !description || !category || !goalAmount || !totalCost) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (Number(totalCost) < Number(goalAmount)) {
      toast.error('Total cost cannot be less than the goal amount');
      return;
    }

    setLoading(true);

    try {
      const hasConfidentialInfo = financialPlanUrl || technicalDetailsUrl || additionalNotes;

await createProject({
  title,
  description,
  category,
  goalAmount: Number(goalAmount),
  totalCost: Number(totalCost),
  images,
  confidentialInfo: hasConfidentialInfo
    ? {
        financialPlanUrl: financialPlanUrl || undefined,
        technicalDetailsUrl: technicalDetailsUrl || undefined,
        additionalNotes: additionalNotes || undefined
      }
    : undefined
});

      toast.success('Project submitted successfully!');
      router.push('/dashboard/projects');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Project Title</Label>
        <Input
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={5}
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='category'>Category</Label>
        <Select value={category} onValueChange={(value) => setCategory(value ?? '')} disabled={loading}>
          <SelectTrigger id='category' className='w-full'>
            <SelectValue placeholder='Select a category' />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-2'>
          <Label htmlFor='goalAmount'>Goal Amount ($)</Label>
          <Input
            id='goalAmount'
            type='number'
            min='1'
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='totalCost'>Total Project Cost ($)</Label>
          <Input
            id='totalCost'
            type='number'
            min='1'
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='images'>Project Images</Label>
        <Input
          id='images'
          type='file'
          accept='image/*'
          multiple
          onChange={handleImageChange}
          disabled={loading || uploading}
        />
        {uploading && <p className='text-sm text-muted-foreground'>Uploading images...</p>}

        {images.length > 0 && (
          <div className='grid grid-cols-3 gap-3 pt-2'>
            {images.map((url, index) => (
              <div key={url} className='relative'>
                <img src={url} alt={`Project image ${index + 1}`} className='h-24 w-full rounded-md object-cover' />
                <button
                  type='button'
                  onClick={() => removeImage(index)}
                  className='absolute top-1 right-1 rounded-full bg-black/60 px-1.5 text-xs text-white'
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
<div className='space-y-3 rounded-lg border border-dashed border-border/70 p-4'>
  <p className='text-sm font-medium'>Confidential Information (optional)</p>
  <p className='text-xs text-muted-foreground'>
    Only visible to investors you approve via an NDA request. You can also add this later from My Projects.
  </p>

  <div className='space-y-2'>
    <Label>Financial Plan (PDF)</Label>
    <Input
      type='file'
      accept='application/pdf'
      onChange={(e) => handleConfidentialUpload(e, setFinancialPlanUrl, 'Financial Plan')}
      disabled={loading || uploadingConfidential !== null}
    />
    {financialPlanUrl && <p className='text-xs text-muted-foreground'>✓ Uploaded</p>}
  </div>

  <div className='space-y-2'>
    <Label>Technical / IP Details (PDF)</Label>
    <Input
      type='file'
      accept='application/pdf'
      onChange={(e) => handleConfidentialUpload(e, setTechnicalDetailsUrl, 'Technical Details')}
      disabled={loading || uploadingConfidential !== null}
    />
    {technicalDetailsUrl && <p className='text-xs text-muted-foreground'>✓ Uploaded</p>}
  </div>

  <div className='space-y-2'>
    <Label>Additional Notes</Label>
    <Textarea
      value={additionalNotes}
      onChange={(e) => setAdditionalNotes(e.target.value)}
      disabled={loading}
      rows={3}
    />
  </div>
</div>
      <Button disabled={loading || uploading} className='w-full' type='submit'>
        {loading ? 'Submitting...' : 'Submit Project'}
      </Button>
    </form>
  );
}