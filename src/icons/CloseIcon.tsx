import { SVGProps } from 'react';

const CloseIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill={props.fill}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={props.className}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 1.1958L1.1958 0L7.00002 5.82197L12.8214 0L14 1.1958L8.1952 7.00002L14 12.8214L12.8214 14L7.00002 8.1952L1.1958 14L0 12.8214L5.82197 7.00002L0 1.1958Z"
        fill={props.fill}
      />
    </svg>
  );
};

export default CloseIcon;
