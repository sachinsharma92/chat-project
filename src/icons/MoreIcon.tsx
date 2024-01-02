import { SVGProps } from 'react';

const MoreIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="12"
      height="4"
      viewBox="0 0 12 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.9994 3.19977H9.59988V0.800232H12L11.9994 3.19977ZM7.19977 3.19977H4.79965V0.800232H7.19977V3.19977ZM2.40012 3.19977H0V0.800232H2.40012V3.19977Z"
        fill="white"
      />
    </svg>
  );
};

export default MoreIcon;
