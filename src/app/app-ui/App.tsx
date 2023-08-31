'use client';

import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import MainComponent from '@/ui/features/MainComponent/MainComponent';
import './App.css';

function App() {
  const ref = useRef<HTMLDivElement>(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = dataUrl;
        link.click();
      })
      .catch(err => {
        console.log(err);
      });
  }, [ref]);

  return (
    <div className="root-container" ref={ref}>
      <MainComponent handleCameraButtonClick={onButtonClick} />
    </div>
  );
}

export default App;
