import MainComponent from '@/ui/features/MainComponent/MainComponent';
import './App.css';

// SSR
// Grab the dom by calling 'getElementById'
export const AppRootContainerId = 'AppRootContainerId';

function App() {
  return (
    <div className="root-container" id={AppRootContainerId}>
      <MainComponent />
    </div>
  );
}

export default App;
