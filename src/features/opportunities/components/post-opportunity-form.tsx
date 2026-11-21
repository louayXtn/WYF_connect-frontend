'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { createOpportunity } from '@/lib/opportunities-api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { getCurrentUser } from '@/lib/auth';
const TYPES = [
  { value: 'equity', label: 'Equity Financing' },
  { value: 'grant', label: 'Non-dilutive Grant' },
  { value: 'pre_seed', label: 'Pre-seed / Accelerator Fund' },
  { value: 'incubation', label: 'Incubation / Acceleration' }
];

const STAGES = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'mvp', label: 'MVP' },
  { value: 'startup', label: 'Startup' }
];

const INDUSTRIES = [
  'Technology',
  'Agriculture',
  'Fintech',
  'Health',
  'Education',
  'E-commerce',
  'Sustainability',
  'Other'
];

export default function PostOpportunityForm() {
  const router = useRouter();
  const currentUser = getCurrentUser();

if (currentUser?.role !== 'investor') {
  return (
    <div className='rounded-lg border border-border/70 bg-muted/30 p-6 text-center text-sm text-muted-foreground'>
      Only investor accounts can post opportunities.
    </div>
  );
}
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [fundingMin, setFundingMin] = useState('');
  const [fundingMax, setFundingMax] = useState('');
  const [targetStage, setTargetStage] = useState('');
  const [targetIndustries, setTargetIndustries] = useState<string[]>([]);
  const [geographicScope, setGeographicScope] = useState('');
  const [deadline, setDeadline] = useState('');

  const [requirePitchDeck, setRequirePitchDeck] = useState(false);
  const [requireFinancialModel, setRequireFinancialModel] = useState(false);
  const [requirePitchVideo, setRequirePitchVideo] = useState(false);

  function toggleIndustry(industry: string) {
    setTargetIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !type || !description || !fundingMin || !fundingMax || !targetStage) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (Number(fundingMax) < Number(fundingMin)) {
      toast.error('Maximum funding cannot be less than minimum');
      return;
    }

    setLoading(true);
    try {
      await createOpportunity({
        title,
        type,
        description,
        fundingMin: Number(fundingMin),
        fundingMax: Number(fundingMax),
        targetStage,
        targetIndustries,
        geographicScope: geographicScope ? geographicScope.split(',').map((s) => s.trim()) : [],
        requiredDocuments: {
          pitchDeck: requirePitchDeck,
          financialModel: requireFinancialModel,
          pitchVideo: requirePitchVideo
        },
        deadline: deadline || undefined
      });

      toast.success('Opportunity posted successfully!');
      router.push('/dashboard/opportunities');
    } catch (err: any) {
      toast.error(err.message || 'Failed to post opportunity');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Opportunity Title</Label>
        <Input id='title' value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} required />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='type'>Type of Funding</Label>
        <Select value={type} onValueChange={(v) => setType(v ?? '')} disabled={loading}>
          <SelectTrigger id='type' className='w-full'>
            <SelectValue placeholder='Select type' />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={4}
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-2'>
          <Label htmlFor='fundingMin'>Minimum Funding ($)</Label>
          <Input
            id='fundingMin'
            type='number'
            min='0'
            value={fundingMin}
            onChange={(e) => setFundingMin(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='fundingMax'>Maximum Funding ($)</Label>
          <Input
            id='fundingMax'
            type='number'
            min='0'
            value={fundingMax}
            onChange={(e) => setFundingMax(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='targetStage'>Target Stage</Label>
        <Select value={targetStage} onValueChange={(v) => setTargetStage(v ?? '')} disabled={loading}>
          <SelectTrigger id='targetStage' className='w-full'>
            <SelectValue placeholder='Select stage' />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label>Target Industries</Label>
        <div className='flex flex-wrap gap-3'>
          {INDUSTRIES.map((industry) => (
            <label key={industry} className='flex items-center gap-1.5 text-sm'>
              <Checkbox
                checked={targetIndustries.includes(industry)}
                onCheckedChange={() => toggleIndustry(industry)}
                disabled={loading}
              />
              {industry}
            </label>
          ))}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='geographicScope'>Geographic Scope (comma-separated, leave empty for international)</Label>
        <Input
          id='geographicScope'
          placeholder='e.g. Tunisia, Morocco, Algeria'
          value={geographicScope}
          onChange={(e) => setGeographicScope(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='deadline'>Application Deadline (optional)</Label>
        <Input
          id='deadline'
          type='date'
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className='space-y-2'>
        <Label>Required Documents from Applicants</Label>
        <div className='flex flex-col gap-2'>
          <label className='flex items-center gap-1.5 text-sm'>
            <Checkbox checked={requirePitchDeck} onCheckedChange={(c) => setRequirePitchDeck(c === true)} disabled={loading} />
            Pitch Deck
          </label>
          <label className='flex items-center gap-1.5 text-sm'>
            <Checkbox
              checked={requireFinancialModel}
              onCheckedChange={(c) => setRequireFinancialModel(c === true)}
              disabled={loading}
            />
            Financial Model
          </label>
          <label className='flex items-center gap-1.5 text-sm'>
            <Checkbox checked={requirePitchVideo} onCheckedChange={(c) => setRequirePitchVideo(c === true)} disabled={loading} />
            Pitch Video (optional for applicant)
          </label>
        </div>
      </div>

      <Button type='submit' disabled={loading} className='w-full'>
        {loading ? 'Posting...' : 'Post Opportunity'}
      </Button>
    </form>
  );
}