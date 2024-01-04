import { SVGProps } from 'react';

const StopIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="12" height="12" fill="white" />
    </svg>
  );
};

export default StopIcon;
