import PageContainer from '@/components/layout/page-container';
import AdminDashboard from '@/features/admin/components/admin-dashboard';

export default function AdminPage() {
  return (
    <PageContainer
      pageTitle='Admin Dashboard'
      pageDescription='Review identity verification requests and pending investments.'
    >
      <AdminDashboard />
    </PageContainer>
  );
}
