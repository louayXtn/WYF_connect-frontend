import PageContainer from '@/components/layout/page-container';
import VerifyIdentityForm from '@/features/verification/components/verify-identity-form';

export default function VerifyIdentityPage() {
  return (
    <PageContainer
      pageTitle='Verify Your Identity'
      pageDescription='Verified accounts get a trust badge and can invest in projects on WYF Connect.'
    >
      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-sm'>
        <VerifyIdentityForm />
      </div>
    </PageContainer>
  );
}
