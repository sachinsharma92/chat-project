import { SVGProps } from 'react';

const HeartIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      {...props}
    >
      <path
        d="M1 5.496C1 8.241 3.3394 10.9476 6.9922 13.2564C7.195 13.3782 7.4362 13.5 7.6 13.5C7.7698 13.5 8.0116 13.3782 8.2078 13.2564C11.86 10.9476 14.2 8.2404 14.2 5.496C14.2 3.1416 12.547 1.5 10.4032 1.5C9.1618 1.5 8.188 2.064 7.6 2.9112C7.0252 2.0712 6.0448 1.5 4.7968 1.5C2.6596 1.5 1 3.1416 1 5.496Z"
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default HeartIcon;
