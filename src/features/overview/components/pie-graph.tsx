'use client';

import { LabelList, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

interface PieGraphProps {
  data: { category: string; count?: number; amount?: number }[];
  valueLabel: string;
}

export function PieGraph({ data, valueLabel }: PieGraphProps) {
  const chartData = data.map((d, i) => ({
    category: d.category,
    value: d.count ?? d.amount ?? 0,
    fill: COLORS[i % COLORS.length]
  }));

  const chartConfig = chartData.reduce((acc, d, i) => {
    acc[d.category] = { label: d.category, color: COLORS[i % COLORS.length] };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>
          By Category
          <Badge variant='outline'>
            <Icons.trendingUp />
            {valueLabel}
          </Badge>
        </CardTitle>
        <CardDescription>Distribution across project categories</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center justify-center pb-0'>
        {chartData.length === 0 ? (
          <p className='text-muted-foreground text-sm py-12'>No data yet.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px] min-h-[250px]'
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey='value' hideLabel />} />
              <Pie
                data={chartData}
                innerRadius={30}
                dataKey='value'
                nameKey='category'
                radius={10}
                cornerRadius={8}
                paddingAngle={4}
              >
                <LabelList
                  dataKey='value'
                  stroke='none'
                  fontSize={12}
                  fontWeight={500}
                  fill='currentColor'
                  formatter={(value: any) => String(value ?? '')}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}