import { SVGProps } from 'react';

const SpacesIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.03903 4.62494C1.3899 5.07276 1 5.82666 1 6.63398V12.5854C1 13.919 2.04467 15 3.33333 15H12.6667C13.9553 15 15 13.919 15 12.5854V6.63398C15 5.82666 14.6101 5.07276 13.961 4.62494L9.2943 1.40553C8.51054 0.864825 7.48947 0.864825 6.7057 1.40553L2.03903 4.62494ZM7.99997 11.5C9.28864 11.5 10.3333 10.4554 10.3333 9.1667C10.3333 7.87803 9.28864 6.83337 7.99997 6.83337C6.71131 6.83337 5.66664 7.87803 5.66664 9.1667C5.66664 10.4554 6.71131 11.5 7.99997 11.5Z"
        stroke="#BAB7A4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default SpacesIcon;
