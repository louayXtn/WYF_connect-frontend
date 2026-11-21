'use client';

import PageContainer from '@/components/layout/page-container';
import { Input } from '@/components/ui/input';
import { ProjectCard } from '@/features/projects/components/project-card';
import { fetchProjects, type Project } from '@/lib/projects-api';
import { useEffect, useState } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProjects({ search: search || undefined });
        setProjects(data.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(load, 300); // debounce بسيط للبحث
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <PageContainer
      pageTitle='Projects Feed'
      pageDescription='Browse public pitches and elevator pitches from youth founders across the marketplace.'
    >
      <div className='space-y-4'>
        <Input
          placeholder='Search projects...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-sm'
        />

        {loading ? (
          <p className='text-muted-foreground'>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className='rounded-xl border border-border/70 bg-card p-6 text-center shadow-sm'>
            <p className='text-muted-foreground'>No projects found yet.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}