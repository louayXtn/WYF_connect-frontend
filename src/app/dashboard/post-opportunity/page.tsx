import PageContainer from '@/components/layout/page-container';
import PostOpportunityForm from '@/features/opportunities/components/post-opportunity-form';

export default function PostOpportunityPage() {
  return (
    <PageContainer
      pageTitle='Post an Opportunity'
      pageDescription='Offer funding, grants, or acceleration programs to youth founders.'
    >
      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-sm'>
        <PostOpportunityForm />
      </div>
    </PageContainer>
  );
}
