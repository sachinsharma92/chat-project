'use client';

import dynamic from 'next/dynamic';

const CreatorSettings = dynamic(() => import('@/ui/features/CreatorSettings'), {
  ssr: false,
});

const DashboardPage = () => {
  return (
    <div className="flex items-center justify-center h-full w-full box-border bg-[#fff] overflow-y-auto">
      <CreatorSettings />
    </div>
  );
};

export default DashboardPage;
