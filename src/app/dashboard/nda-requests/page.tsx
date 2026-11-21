import PageContainer from '@/components/layout/page-container';
import NdaRequestsView from '@/features/projects/components/nda-requests-view';

export default function NdaRequestsPage() {
  return (
    <PageContainer
      pageTitle='NDA Requests'
      pageDescription='Review and respond to confidentiality access requests from investors on your projects.'
    >
      <NdaRequestsView />
    </PageContainer>
  );
}