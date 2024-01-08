import { SVGProps } from 'react';

const ArrowNext = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.6786 4.25351H3.15672L6.36576 1.04519L5.32057 0L0.321289 5L5.32057 10L6.36576 8.95481L3.15672 5.74649H13.6786V4.25351Z"
        fill="white"
      />
    </svg>
  );
};

export default ArrowNext;
