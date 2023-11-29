'use client';

import './App.css';
import dynamic from 'next/dynamic';

const MainComponent = dynamic(
  () => import('@/ui/features/MainComponent/MainComponent'),
  {
    ssr: false,
  },
);

// SSR
// Grab the dom by calling 'getElementById'
export const AppRootContainerId = 'AppRootContainerId';

function App() {
  return (
    <div className="root-container" id={AppRootContainerId}>
      <MainComponent />
      <audio id="bot-audio" className="bot-audio" src=""></audio>
    </div>
  );
}

export default App;
