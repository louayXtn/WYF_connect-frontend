import { Metadata } from 'next';
import ForgotPasswordView from '@/features/auth/components/forgot-password-view';

export const metadata: Metadata = {
  title: 'Forgot Password | WYF Connect',
  description: 'Reset your WYF Connect password.'
};

export default function Page() {
  return <ForgotPasswordView />;
}