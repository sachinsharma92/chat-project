'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../app-ui/App'), { ssr: false });

const CreatorPage = () => <App />;

export default CreatorPage;
