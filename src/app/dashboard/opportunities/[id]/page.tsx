import OpportunityDetailView from '@/features/opportunities/components/opportunity-detail-view';

export default async function OpportunityDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OpportunityDetailView opportunityId={id} />;
}
