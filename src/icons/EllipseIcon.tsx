import { SVGProps } from 'react';

const EllipseIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="6"
      viewBox="0 0 5 6"
      fill="none"
      {...props}
    >
      <circle cx="2.5" cy="3" r="2.5" fill="#8AC68A" />
    </svg>
  );
};

export default EllipseIcon;
