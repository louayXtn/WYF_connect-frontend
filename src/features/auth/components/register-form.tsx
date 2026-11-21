'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { countryList } from '@/lib/countries';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty
} from '@/components/ui/combobox';
export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nationality, setNationality] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('youth');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!isTermsAccepted) {
      toast.error('You must accept the terms and conditions');
      return;
    }

    setLoading(true);

    const fullPhoneNumber =
      phoneCode && phoneNumber ? `${phoneCode} ${phoneNumber}` : phoneNumber || undefined;

    try {
      const data = await apiClient<{ user: any; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          nationality,
          countryOfResidence,
          phoneNumber: fullPhoneNumber,
          role,
          isTermsAccepted
        })
      });

      document.cookie = `wyf_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 30}`;

      toast.success('Account created successfully!');
      router.push('/dashboard/overview');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full space-y-4'>
      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-2'>
          <Label htmlFor='firstName'>First Name</Label>
          <Input
            id='firstName'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='lastName'>Last Name</Label>
          <Input
            id='lastName'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            minLength={6}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input
            id='confirmPassword'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            minLength={6}
            required
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-2'>
          <Label htmlFor='nationality'>Nationality</Label>
          <Select value={nationality} onValueChange={(value) => setNationality(value ?? '')} disabled={loading}>
            <SelectTrigger id='nationality' className='w-full'>
              <SelectValue placeholder='Select nationality' />
            </SelectTrigger>
            <SelectContent>
              {countryList.map((c) => (
                <SelectItem key={c.code} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='countryOfResidence'>Country of Residence</Label>
          <Select
            value={countryOfResidence}
            onValueChange={(value) => setCountryOfResidence(value ?? '')}
            disabled={loading}
          >
            <SelectTrigger id='countryOfResidence' className='w-full'>
              <SelectValue placeholder='Select country' />
            </SelectTrigger>
            <SelectContent>
              {countryList.map((c) => (
                <SelectItem key={c.code} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='space-y-2'>
  <Label htmlFor='phoneNumber'>Phone Number (optional)</Label>
  <div className='flex gap-2'>
    <Combobox
  items={countryList.map((c) => ({
    label: `${c.dialCode} (${c.code})`,
    value: c.code, // فريد لكل دولة، حتى لو تشاركت بنفس الـ dialCode
    dialCode: c.dialCode
  }))}
  value={countryList.find((c) => c.dialCode === phoneCode)?.code || ''}
  onValueChange={(value) => {
    const selected = countryList.find((c) => c.code === value);
    setPhoneCode(selected?.dialCode || '');
  }}
  disabled={loading}
>
  <ComboboxInput placeholder='+216' className='w-32' />
  <ComboboxContent>
    <ComboboxEmpty>No country found</ComboboxEmpty>
    <ComboboxList>
      {(item: { label: string; value: string; dialCode: string }) => (
        <ComboboxItem key={item.value} value={item.value}>
          {item.label}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
    <Input
      id='phoneNumber'
      type='tel'
      placeholder='94123456'
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      disabled={loading}
      className='flex-1'
    />
  </div>
</div>

      <div className='space-y-2'>
        <Label htmlFor='role'>Account Type</Label>
        <Select value={role} onValueChange={(value) => setRole(value ?? '')} disabled={loading}>
          <SelectTrigger id='role' className='w-full'>
            <SelectValue placeholder='Select account type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='youth'>Youth Founder</SelectItem>
            <SelectItem value='investor'>Investor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-2'>
        <Checkbox
          id='terms'
          checked={isTermsAccepted}
          onCheckedChange={(checked) => setIsTermsAccepted(checked === true)}
          disabled={loading}
        />
        <Label htmlFor='terms' className='text-sm font-normal'>
          I accept the terms and conditions
        </Label>
      </div>

      <Button disabled={loading} className='w-full' type='submit'>
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}