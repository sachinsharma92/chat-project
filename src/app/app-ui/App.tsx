import MainComponent from '@/ui/features/MainComponent/MainComponent';
import './App.css';
import LoadingScreen from '@/canvas/LoadingReveal/LoadingScreen';

// SSR
// Grab the dom by calling 'getElementById'
export const AppRootContainerId = 'AppRootContainerId';

function App() {
  return (
    <div className="root-container" id={AppRootContainerId}>
      <MainComponent />
      <LoadingScreen />
    </div>
  );
}

export default App;
