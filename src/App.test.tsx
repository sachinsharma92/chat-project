import { render } from '@testing-library/react';
import App from './App';

test('Render main component', () => {
  const { container } = render(<App />);

  expect(container.getElementsByClassName('main-component').length).toBe(1);
});
