import { SVGProps } from 'react';

const ExpandV2Icon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill={props.fill}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={props.className}
    >
      <path
        d="M7.68783 0V0.82088H10.5999L6.94996 4.47079L7.52929 5.05012L11.1792 1.40021V4.31225H12.0001V6.54709e-05L7.68783 0Z"
        fill={props.fill}
      />
      <path
        d="M4.31213 0.820919V3.93107e-05H-6.10352e-05V4.31223H0.820819V1.40018L4.47073 5.0501L5.05006 4.47077L1.40015 0.820854L4.31213 0.820919Z"
        fill={props.fill}
      />
      <path
        d="M11.1791 10.5998L7.52917 6.94988L6.94984 7.52921L10.5998 11.1791H7.68771V12H11.9999V7.68781H11.179L11.1791 10.5998Z"
        fill={props.fill}
      />
      <path
        d="M4.47079 6.94988L0.820871 10.5998V7.68775H-8.60532e-06V11.9999H4.31218V11.1791H1.40014L5.05005 7.52914L4.47079 6.94988Z"
        fill={props.fill}
      />
    </svg>
  );
};

export default ExpandV2Icon;
