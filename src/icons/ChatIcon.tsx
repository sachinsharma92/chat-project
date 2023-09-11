import { SVGProps } from 'react';

const ChatIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      {...props}
    >
      <path
        d="M1.26365 11.0408H5.37614L6.5416 13.2912C6.68686 13.5727 7.43707 13.5684 7.57549 13.2852L8.67344 11.0407H12.7363C13.431 11.0407 14 10.4752 14 9.78289L13.9991 1.75785C13.9991 1.06641 13.4309 0.5 12.7354 0.5L1.26372 0.50085C0.569047 0.50085 0 1.06643 0 1.75785V9.78289C0 10.4752 0.569004 11.0408 1.26365 11.0408ZM10.6882 4.77105C11.2496 4.77105 11.7041 5.2235 11.7041 5.78227C11.7041 6.34103 11.2496 6.79348 10.6882 6.79348C10.1268 6.79348 9.67227 6.34103 9.67227 5.78227C9.67227 5.2235 10.1277 4.77105 10.6882 4.77105ZM6.99962 4.77105C7.56099 4.77105 8.01555 5.2235 8.01555 5.78227C8.01555 6.34103 7.56099 6.79348 6.99962 6.79348C6.43825 6.79348 5.98369 6.34103 5.98369 5.78227C5.98369 5.2235 6.43825 4.77105 6.99962 4.77105ZM3.31104 4.77105C3.87241 4.77105 4.32697 5.2235 4.32697 5.78227C4.32697 6.34103 3.87241 6.79348 3.31104 6.79348C2.74967 6.79348 2.29511 6.34103 2.29511 5.78227C2.29426 5.2235 2.74967 4.77105 3.31104 4.77105Z"
        fill="#FFFFF7"
      />
    </svg>
  );
};

export default ChatIcon;
