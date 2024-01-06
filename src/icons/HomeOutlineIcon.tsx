import { SVGProps } from 'react';

const HomeOutlineIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.3359 5.66064C1.5013 6.23641 1 7.20571 1 8.24369V15.8956C1 17.6101 2.34315 19 4 19H16C17.6569 19 19 17.6101 19 15.8956V8.24369C19 7.20571 18.4987 6.23641 17.6641 5.66064L11.6641 1.52139C10.6564 0.826204 9.3436 0.826203 8.3359 1.52139L2.3359 5.66064ZM9.99996 14.5C11.6568 14.5 13 13.1569 13 11.5C13 9.84319 11.6568 8.50004 9.99996 8.50004C8.34311 8.50004 6.99996 9.84319 6.99996 11.5C6.99996 13.1569 8.34311 14.5 9.99996 14.5Z"
        stroke="#999999"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HomeOutlineIcon;
