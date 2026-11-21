'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { deleteProject, fetchAllProjectsAdmin, type Project } from '@/lib/projects-api';
import { deleteOpportunity, fetchAllOpportunitiesAdmin, type Opportunity } from '@/lib/opportunities-api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminContentView() {
  return (
    <Tabs defaultValue='projects' className='space-y-4'>
      <TabsList>
        <TabsTrigger value='projects'>Projects</TabsTrigger>
        <TabsTrigger value='opportunities'>Opportunities</TabsTrigger>
      </TabsList>

      <TabsContent value='projects'>
        <ProjectsAdminList />
      </TabsContent>

      <TabsContent value='opportunities'>
        <OpportunitiesAdminList />
      </TabsContent>
    </Tabs>
  );
}

function ProjectsAdminList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAllProjectsAdmin({
        search: search || undefined,
        status: status !== 'all' ? status : undefined
      });
      setProjects(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  async function handleDelete(id: string) {
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete project');
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex gap-3'>
        <Input placeholder='Search by title...' value={search} onChange={(e) => setSearch(e.target.value)} className='max-w-sm' />
        <Select value={status} onValueChange={(v) => setStatus(v ?? 'all')}>
          <SelectTrigger className='w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All statuses</SelectItem>
            <SelectItem value='active'>Active</SelectItem>
            <SelectItem value='funded'>Funded</SelectItem>
            <SelectItem value='closed'>Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className='text-muted-foreground'>Loading...</p>
      ) : projects.length === 0 ? (
        <p className='text-muted-foreground'>No projects found.</p>
      ) : (
        <div className='space-y-3'>
          {projects.map((p) => (
            <Card key={p._id}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <Link href={`/dashboard/projects/${p._id}`} className='font-semibold hover:underline'>
                    {p.title}
                  </Link>
                  <Badge variant={p.status === 'closed' ? 'outline' : 'secondary'}>{p.status}</Badge>
                </div>
                <p className='text-xs text-muted-foreground'>
                  By {p.owner?.firstName} {p.owner?.lastName} — {p.category}
                </p>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger render={<Button variant='destructive' size='sm'>Delete</Button>} />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete "{p.title}"?</DialogTitle>
                    </DialogHeader>
                    <p className='text-sm text-muted-foreground'>
                      As an admin, this will permanently delete the project even if it has confirmed investments.
                      This cannot be undone.
                    </p>
                    <DialogFooter>
                      <Button variant='destructive' onClick={() => handleDelete(p._id)}>
                        Delete Permanently
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function OpportunitiesAdminList() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAllOpportunitiesAdmin({
        search: search || undefined,
        status: status !== 'all' ? status : undefined
      });
      setOpportunities(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  async function handleDelete(id: string) {
    try {
      await deleteOpportunity(id);
      toast.success('Opportunity deleted');
      setOpportunities((prev) => prev.filter((o) => o._id !== id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete opportunity');
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex gap-3'>
        <Input placeholder='Search by title...' value={search} onChange={(e) => setSearch(e.target.value)} className='max-w-sm' />
        <Select value={status} onValueChange={(v) => setStatus(v ?? 'all')}>
          <SelectTrigger className='w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All statuses</SelectItem>
            <SelectItem value='open'>Open</SelectItem>
            <SelectItem value='under_review'>Under Review</SelectItem>
            <SelectItem value='closed'>Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className='text-muted-foreground'>Loading...</p>
      ) : opportunities.length === 0 ? (
        <p className='text-muted-foreground'>No opportunities found.</p>
      ) : (
        <div className='space-y-3'>
          {opportunities.map((o) => (
            <Card key={o._id}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <Link href={`/dashboard/opportunities/${o._id}`} className='font-semibold hover:underline'>
                    {o.title}
                  </Link>
                  <Badge variant={o.status === 'closed' ? 'outline' : 'secondary'}>{o.status}</Badge>
                </div>
                <p className='text-xs text-muted-foreground'>{o.entityName}</p>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger render={<Button variant='destructive' size='sm'>Delete</Button>} />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete "{o.title}"?</DialogTitle>
                    </DialogHeader>
                    <p className='text-sm text-muted-foreground'>
                      As an admin, this will permanently delete the opportunity even if it has accepted applications.
                      This cannot be undone.
                    </p>
                    <DialogFooter>
                      <Button variant='destructive' onClick={() => handleDelete(o._id)}>
                        Delete Permanently
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}