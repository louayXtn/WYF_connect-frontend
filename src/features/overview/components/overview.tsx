'use client';

import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction
} from '@/components/ui/card';
import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { RecentSales } from './recent-sales';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { fetchDashboardStats, type DashboardStats } from '@/lib/dashboard-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function OverViewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => toast.error(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <p className='text-muted-foreground p-4'>Loading dashboard...</p>
      </PageContainer>
    );
  }

  if (!stats) {
    return (
      <PageContainer>
        <p className='text-muted-foreground p-4'>Failed to load dashboard data.</p>
      </PageContainer>
    );
  }

  const isYouth = stats.role === 'youth';

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2 overflow-x-hidden min-w-0'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Welcome to WYF Connect 👋</h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:min-w-0 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 md:grid-cols-2'>
          {isYouth ? (
            <>
              <StatCard
                label='My Projects'
                value={stats.personal.totalProjects ?? 0}
                icon={<Icons.post className='size-4' />}
                note='Projects you have submitted'
              />
              <StatCard
                label='Total Funding Received'
                value={`$${(stats.personal.totalFunding ?? 0).toLocaleString()}`}
                icon={<Icons.billing className='size-4' />}
                note='Confirmed funding across your projects'
              />
              <StatCard
                label='My Investors'
                value={stats.personal.totalInvestors ?? 0}
                icon={<Icons.teams className='size-4' />}
                note='Unique investors backing you'
              />
              <StatCard
                label='Platform Projects'
                value={stats.platform.totalProjects}
                icon={<Icons.dashboard className='size-4' />}
                note='Total projects on WYF Connect'
              />
            </>
          ) : (
            <>
              <StatCard
                label='My Investments'
                value={stats.personal.totalInvestments ?? 0}
                icon={<Icons.billing className='size-4' />}
                note='Confirmed investments you made'
              />
              <StatCard
                label='Total Invested'
                value={`$${(stats.personal.totalInvested ?? 0).toLocaleString()}`}
                icon={<Icons.trendingUp className='size-4' />}
                note='Your total confirmed capital deployed'
              />
              <StatCard
                label='Projects Backed'
                value={stats.personal.projectsBacked ?? 0}
                icon={<Icons.teams className='size-4' />}
                note='Unique projects you invested in'
              />
              <StatCard
                label='Opportunities Posted'
                value={stats.personal.opportunitiesPosted ?? 0}
                icon={<Icons.lock className='size-4' />}
                note='Funding opportunities you created'
              />
            </>
          )}
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>
            <BarGraph data={stats.platform.newUsersChart} />
          </div>
          <Card className='col-span-4 md:col-span-3'>
            <RecentSales
              data={stats.recentActivity}
              title={isYouth ? 'Recent Funding' : 'Recent Investments'}
              description={
                isYouth ? 'Latest confirmed contributions to your projects' : 'Your latest confirmed investments'
              }
            />
          </Card>
          <div className='col-span-4'>
            <AreaGraph data={stats.platform.fundingChart} />
          </div>
          <div className='col-span-4 md:col-span-3'>
            <PieGraph
              data={stats.categoryPie}
              valueLabel={isYouth ? 'By project count' : 'By amount invested'}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function StatCard({
  label,
  value,
  icon,
  note
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  note: string;
}) {
  return (
    <Card className='@container/card overflow-hidden'>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl truncate'>
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant='outline'>
            <Icons.trendingUp />
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
        <div className='flex w-full items-center gap-2 font-medium'>
          <span className='truncate'>{note}</span>
          <span className='shrink-0'>{icon}</span>
        </div>
      </CardFooter>
    </Card>
  );
}