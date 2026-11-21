'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { fetchMyApplications, type MyApplication } from '@/lib/opportunities-api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function MyApplicationsView() {
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications()
      .then(setApplications)
      .catch((err) => toast.error(err.message || 'Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className='text-muted-foreground'>Loading...</p>;

  if (applications.length === 0) {
    return (
      <div className='rounded-xl border border-border/70 bg-card p-6 text-center shadow-sm'>
        <p className='text-muted-foreground'>You haven't applied to any opportunities yet.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {applications.map((app) => (
        <Card key={app._id}>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <Link href={`/dashboard/opportunities/${app.opportunityId}`} className='font-semibold hover:underline'>
                {app.opportunityTitle}
              </Link>
              <Badge
                variant={app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'outline' : 'secondary'}
              >
                {app.status}
              </Badge>
            </div>
            <p className='text-xs text-muted-foreground'>{app.entityName}</p>
          </CardHeader>
          {app.status === 'accepted' && app.contactEmail && (
            <CardContent>
              <p className='rounded-md bg-muted/50 p-2 text-xs'>
                📧 Contact: <a href={`mailto:${app.contactEmail}`}>{app.contactEmail}</a>
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}