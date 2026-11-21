'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VerifiedBadge } from '@/components/verified-badge';
import { fetchMyProfile, refreshToken, updateMyProfile, type UserProfile } from '@/lib/user-api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ProfileViewPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');
  const [entityName, setEntityName] = useState('');

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await fetchMyProfile();
      setProfile(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setPhoneNumber(data.phoneNumber || '');
      setNationality(data.nationality);
      setCountryOfResidence(data.countryOfResidence);
      setEntityName(data.investorProfile?.entityName || '');
    } catch (err: any) {
      toast.error(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSave() {
  setSaving(true);
  try {
    const updated = await updateMyProfile({
      firstName,
      lastName,
      phoneNumber,
      nationality,
      countryOfResidence,
      ...(profile?.role === 'investor' ? { investorProfile: { entityName } } : {})
    });
    setProfile(updated);
    setEditing(false);

    // حدث التوكن بالـ cookie عشان الـ sidebar وأي مكان تاني يعرض البيانات الجديدة
    const { token } = await refreshToken();
    document.cookie = `wyf_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}`;

    toast.success('Profile updated');
  } catch (err: any) {
    toast.error(err.message || 'Failed to update profile');
  } finally {
    setSaving(false);
  }
}

  function handleCancel() {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setPhoneNumber(profile.phoneNumber || '');
      setNationality(profile.nationality);
      setCountryOfResidence(profile.countryOfResidence);
      setEntityName(profile.investorProfile?.entityName || '');
    }
    setEditing(false);
  }

  if (loading) {
    return (
      <div className='flex w-full flex-col p-4'>
        <p className='text-muted-foreground'>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='flex w-full flex-col p-4'>
        <p className='text-muted-foreground'>Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col gap-4 p-4'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                My Profile
                {profile.verification.status === 'verified' && <VerifiedBadge />}
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </div>
            {!editing && (
              <Button variant='outline' size='sm' onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {!editing ? (
            <>
              <div>
                <p className='text-sm text-muted-foreground'>First Name</p>
                <p className='font-medium'>{profile.firstName}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Last Name</p>
                <p className='font-medium'>{profile.lastName}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <p className='font-medium'>{profile.email}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Phone Number</p>
                <p className='font-medium'>{profile.phoneNumber || '—'}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Nationality</p>
                <p className='font-medium'>{profile.nationality}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Country of Residence</p>
                <p className='font-medium'>{profile.countryOfResidence}</p>
              </div>
              {profile.role === 'investor' && (
                <div>
                  <p className='text-sm text-muted-foreground'>Entity Name</p>
                  <p className='font-medium'>{profile.investorProfile?.entityName || '—'}</p>
                </div>
              )}
              <div>
                <p className='text-sm text-muted-foreground'>Account Type</p>
                <p className='font-medium capitalize'>{profile.role}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Verification Status</p>
                <Badge
                  variant={
                    profile.verification.status === 'verified'
                      ? 'default'
                      : profile.verification.status === 'pending'
                        ? 'secondary'
                        : 'outline'
                  }
                  className='capitalize'
                >
                  {profile.verification.status}
                </Badge>
              </div>
            </>
          ) : (
            <>
              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <Label>First Name</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={saving} />
                </div>
                <div className='space-y-1'>
                  <Label>Last Name</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={saving} />
                </div>
              </div>

              <div className='space-y-1'>
                <Label>Email (cannot be changed)</Label>
                <Input value={profile.email} disabled />
              </div>

              <div className='space-y-1'>
                <Label>Phone Number</Label>
                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={saving} />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <Label>Nationality</Label>
                  <Input value={nationality} onChange={(e) => setNationality(e.target.value)} disabled={saving} />
                </div>
                <div className='space-y-1'>
                  <Label>Country of Residence</Label>
                  <Input
                    value={countryOfResidence}
                    onChange={(e) => setCountryOfResidence(e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>

              {profile.role === 'investor' && (
                <div className='space-y-1'>
                  <Label>Entity Name</Label>
                  <Input value={entityName} onChange={(e) => setEntityName(e.target.value)} disabled={saving} />
                </div>
              )}

              <div className='flex gap-2 pt-2'>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant='outline' onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}