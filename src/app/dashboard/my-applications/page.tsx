import PageContainer from '@/components/layout/page-container';
import MyApplicationsView from '@/features/opportunities/components/my-applications-view';

export default function MyApplicationsPage() {
  return (
    <PageContainer
      pageTitle='My Applications'
      pageDescription='Track the status of your applications to investor opportunities.'
    >
      <MyApplicationsView />
    </PageContainer>
  );
}
