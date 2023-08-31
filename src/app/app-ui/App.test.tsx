import { render } from '@testing-library/react';
import App from './App';

describe('<AppUI/>', () => {
  it('should render main component', () => {
    const { container } = render(<App />);

    expect(container.getElementsByClassName('main-component').length).toBe(1);
  });
});

export {};
