import { IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-blue-500 p-0.5',
        className
      )}
      title='Verified'
    >
      <IconCheck className='size-2.5 stroke-[3] text-white' />
    </span>
  );
}