'use client';

import dynamic from 'next/dynamic';
import './page.css';

const CreatorDashboard = dynamic(
  () => import('@/ui/features/CreatorDashboard'),
  {
    ssr: false,
  },
);

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <CreatorDashboard />
    </div>
  );
};

export default DashboardPage;
