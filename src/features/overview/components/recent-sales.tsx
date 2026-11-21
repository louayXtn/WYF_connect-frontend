'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

interface RecentActivityItem {
  label: string;
  detail: string;
  amount: number;
  createdAt: string;
}

interface RecentSalesProps {
  data: RecentActivityItem[];
  title: string;
  description: string;
}

export function RecentSales({ data, title, description }: RecentSalesProps) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className='text-muted-foreground text-sm'>No activity yet.</p>
        ) : (
          <div className='space-y-8'>
            {data.map((item, index) => {
              const initials = item.label
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div key={index} className='flex items-center'>
                  <Avatar className='h-9 w-9'>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className='ml-4 space-y-1'>
                    <p className='text-sm leading-none font-medium'>{item.label}</p>
                    <p className='text-muted-foreground text-sm'>{item.detail}</p>
                  </div>
                  <div className='ml-auto font-medium'>+${item.amount.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}