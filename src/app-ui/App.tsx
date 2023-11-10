import MainComponent from '@/ui/features/MainComponent/MainComponent';
import './App.css';

// SSR
// Grab the dom by calling 'getElementById'
export const AppRootContainerId = 'AppRootContainerId';

function App() {
  return (
    <div className="root-container" id={AppRootContainerId}>
      <MainComponent />
      <audio id="bot-audio" autoPlay className="bot-audio" src=""></audio>
    </div>
  );
}

export default App;
