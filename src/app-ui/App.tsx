'use client';

import './App.css';
import MainComponent from '@/ui/features/MainComponent/MainComponent';

// Grab the dom by calling 'getElementById'
export const AppRootContainerId = 'AppRootContainerId';

const App = () => {
  return (
    <div className="root-container" id={AppRootContainerId}>
      <MainComponent />
      <audio id="bot-audio" className="bot-audio" src=""></audio>
    </div>
  );
};

export default App;
