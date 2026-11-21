'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { fetchOpportunities, type Opportunity } from '@/lib/opportunities-api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const TYPE_LABELS: Record<string, string> = {
  equity: 'Equity Financing',
  grant: 'Non-dilutive Grant',
  pre_seed: 'Pre-seed / Accelerator',
  incubation: 'Incubation / Acceleration'
};

export default function OpportunitiesListView() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchOpportunities({ status: 'open' });
        setOpportunities(data);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load opportunities');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className='text-muted-foreground'>Loading opportunities...</p>;
  }

  if (opportunities.length === 0) {
    return (
      <div className='rounded-xl border border-border/70 bg-card p-6 text-center shadow-sm'>
        <p className='text-muted-foreground'>No opportunities available right now.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {opportunities.map((opp) => (
        <Link key={opp._id} href={`/dashboard/opportunities/${opp._id}`}>
          <Card className='h-full transition-shadow hover:shadow-md'>
            <CardHeader className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Badge variant='outline'>{TYPE_LABELS[opp.type] || opp.type}</Badge>
              </div>
              <h3 className='line-clamp-1 font-semibold'>{opp.title}</h3>
              <p className='text-xs text-muted-foreground'>{opp.entityName}</p>
            </CardHeader>
            <CardContent className='space-y-2'>
              <p className='line-clamp-2 text-sm text-muted-foreground'>{opp.description}</p>
              <p className='text-sm font-medium'>
                ${opp.fundingMin.toLocaleString()} - ${opp.fundingMax.toLocaleString()}
              </p>
              <div className='flex flex-wrap gap-1'>
                {opp.targetIndustries.slice(0, 3).map((ind) => (
                  <Badge key={ind} variant='secondary' className='text-xs'>
                    {ind}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}