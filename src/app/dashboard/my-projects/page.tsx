import PageContainer from '@/components/layout/page-container';
import MyProjectsView from '@/features/projects/components/my-projects-view';

export default function MyProjectsPage() {
  return (
    <PageContainer
      pageTitle='My Projects'
      pageDescription='Manage your submitted projects and track their funding progress.'
    >
      <MyProjectsView />
    </PageContainer>
  );
}
