import PageContainer from '@/components/layout/page-container';
import OpportunitiesListView from '@/features/opportunities/components/opportunities-list-view';

export default function OpportunitiesPage() {
  return (
    <PageContainer
      pageTitle='Investor Opportunities'
      pageDescription='Browse funding offers, grants, and acceleration programs from investors.'
    >
      <OpportunitiesListView />
    </PageContainer>
  );
}