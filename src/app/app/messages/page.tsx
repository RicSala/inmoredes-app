import { PageHeading } from '@/components/PageHeading';

export default async function Home() {
  return (
    <div className='flex flex-col gap-4'>
      <PageHeading title='Messages' description='Manage your messages' />
    </div>
  );
}
