import { RotatingLines } from 'react-loader-spinner';
import { isNumber } from 'lodash';
import './LoadingSpinner.css';

const LoadingSpinner = (props: { width?: number }) => {
  const { width } = props;

  return (
    <div className="loading-spinner">
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width={isNumber(width) && width > 0 ? `${width}` : '20'}
        visible={true}
      />
    </div>
  );
};

export default LoadingSpinner;
