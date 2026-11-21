import PageContainer from '@/components/layout/page-container';
import SubmitProjectForm from '@/features/projects/components/submit-project-form';

export default function SubmitProjectPage() {
  return (
    <PageContainer
      pageTitle='Submit Project'
      pageDescription='Share a new youth venture with the WYF Connect community and begin the investor discovery journey.'
    >
      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-sm'>
        <SubmitProjectForm />
      </div>
    </PageContainer>
  );
}