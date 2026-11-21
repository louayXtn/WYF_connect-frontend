import PageContainer from '@/components/layout/page-container';
import MyOpportunitiesView from '@/features/opportunities/components/my-opportunities-view';

export default function MyOpportunitiesPage() {
  return (
    <PageContainer
      pageTitle='My Opportunities'
      pageDescription='Review applications and manage the opportunities you posted.'
    >
      <MyOpportunitiesView />
    </PageContainer>
  );
}
