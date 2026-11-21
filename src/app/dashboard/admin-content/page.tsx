import PageContainer from '@/components/layout/page-container';
import AdminContentView from '@/features/admin/components/admin-content-view';

export default function AdminContentPage() {
  return (
    <PageContainer
      pageTitle='All Projects & Opportunities'
      pageDescription='Browse, search, and manage every project and opportunity on the platform.'
    >
      <AdminContentView />
    </PageContainer>
  );
}
