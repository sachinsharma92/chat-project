import { SVGProps } from 'react';

const ExploreIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M10 19C14.9705 19 19 14.9705 19 10C19 5.02943 14.9705 1 10 1C5.02943 1 1 5.02943 1 10C1 14.9705 5.02943 19 10 19Z"
        stroke="#BAB7A4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8158 6.18379L11.9078 11.9078L6.18379 13.8158L8.09179 8.09179L13.8158 6.18379Z"
        stroke="#BAB7A4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ExploreIcon;
