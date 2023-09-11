import { SVGProps } from 'react';

const NotificationBellIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="21"
      viewBox="0 0 19 21"
      fill="none"
      {...props}
    >
      <path
        d="M11.2878 18.603C11.1315 18.8758 10.9072 19.1023 10.6373 19.2597C10.3674 19.4171 10.0614 19.5 9.75 19.5C9.43855 19.5 9.13257 19.4171 8.86269 19.2597C8.59281 19.1023 8.3685 18.8758 8.21222 18.603M15.0833 6.90096C15.0833 5.46853 14.5214 4.09478 13.5212 3.0819C12.521 2.06903 11.1645 1.5 9.75 1.5C8.33551 1.5 6.97896 2.06903 5.97876 3.0819C4.97857 4.09478 4.41667 5.46853 4.41667 6.90096C4.41667 13.2021 1.75 15.0024 1.75 15.0024H17.75C17.75 15.0024 15.0833 13.2021 15.0833 6.90096Z"
        stroke="#BAB7A4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NotificationBellIcon;
