import { Metadata } from 'next';
import ResetPasswordView from '@/features/auth/components/reset-password-view';

export const metadata: Metadata = {
  title: 'Reset Password | WYF Connect',
  description: 'Choose a new password for your WYF Connect account.'
};

export default function Page() {
  return <ResetPasswordView />;
}