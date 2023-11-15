import { SVGProps } from 'react';

const ExpandV2Icon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_1932_4002)">
        <path
          d="M9 2H12.6L8.6 6L10 7.4L14 3.4V7H16V0H9V2ZM6 8.6L2 12.6V9H0V16H7V14H3.4L7.4 10L6 8.6Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_1932_4002">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ExpandV2Icon;
