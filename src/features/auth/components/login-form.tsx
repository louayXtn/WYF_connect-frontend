'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiClient<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      document.cookie = `wyf_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 30}`;

      toast.success('Signed in successfully!');
      router.push('/dashboard/overview');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          placeholder='Enter your email...'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          placeholder='Enter your password...'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      <Button disabled={loading} className='w-full' type='submit'>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      <div className='flex justify-end'>
  <Link href='/auth/forgot-password' className='text-sm text-muted-foreground underline underline-offset-4'>
    Forgot password?
  </Link>
</div>
      

<p className='text-center text-sm text-muted-foreground'>
  Don&apos;t have an account?{' '}
  <Link href='/auth/sign-up' className='font-medium text-primary underline underline-offset-4'>
    Create account
  </Link>
</p>
    </form>
  );
}