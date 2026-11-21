import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Project } from '@/lib/projects-api';
import Link from 'next/link';
import { VerifiedBadge } from '@/components/verified-badge';
export function ProjectCard({ project }: { project: Project }) {
  const percentage = Math.min(
    Math.round((project.fundedAmount / project.goalAmount) * 100),
    100
  );

  const coverImage = project.images?.[0] || null;

  return (
    <Link href={`/dashboard/projects/${project._id}`}>
      <Card className='h-full overflow-hidden transition-shadow hover:shadow-md'>
        <div className='relative h-40 w-full bg-muted'>
          {coverImage ? (
            <img src={coverImage} alt={project.title} className='h-full w-full object-cover' />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-muted-foreground text-sm'>
              No image
            </div>
          )}
          <Badge variant='outline' className='absolute top-2 right-2 bg-background'>
            {project.category}
          </Badge>
        </div>

        <CardHeader className='pb-2'>
          <h3 className='line-clamp-1 text-base font-semibold'>{project.title}</h3>
          <p className='line-clamp-2 text-sm text-muted-foreground'>{project.description}</p>
        </CardHeader>

        <CardContent className='space-y-2 pb-2'>
          <Progress value={percentage} />
          <div className='flex items-center justify-between text-sm'>
            <span className='font-medium'>{percentage}% funded</span>
            <span className='text-muted-foreground'>
              ${project.fundedAmount.toLocaleString()} / ${project.goalAmount.toLocaleString()}
            </span>
          </div>
        </CardContent>

        <CardFooter className='flex items-center justify-between text-xs text-muted-foreground'>
  <span className='flex items-center gap-1'>
    By {project.owner?.firstName} {project.owner?.lastName}
    {project.owner?.verification?.status === 'verified' && <VerifiedBadge />}
  </span>
  <span>{project.investorsCount} investor{project.investorsCount !== 1 ? 's' : ''}</span>
</CardFooter>
      </Card>
    </Link>
  );
}