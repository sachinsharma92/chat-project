'use client';

import './App.css';
import MainComponent from '@/ui/features/MainComponent/MainComponent';

// Grab the dom by calling 'getElementById'
export const AppRootContainerId = 'AppRootContainerId';

const App = () => {
  return (
    <div className="root-container" id={AppRootContainerId}>
      <MainComponent />
      <audio id="bot-audio" controls className="bot-audio">
        <source
          id="bot-audio-source"
          src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
          type="audio/mpeg"
        ></source>
      </audio>
    </div>
  );
};

export default App;
