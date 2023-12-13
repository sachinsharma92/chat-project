import { SVGProps } from 'react';

const PlayIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="13"
      viewBox="0 0 11 13"
      fill="none"
      {...props}
    >
      <path
        d="M10.2529 7.02222L0.905887 12.4192H0.904788C0.717892 12.5269 0.488109 12.5269 0.30123 12.4192C0.115432 12.3115 0 12.1125 0 11.897V1.10302C0 0.887545 0.115437 0.688542 0.30123 0.580805C0.488126 0.473065 0.717909 0.473065 0.904788 0.580805L10.2518 5.97778H10.2529C10.4387 6.08552 10.5542 6.2845 10.5542 6.5C10.5542 6.7155 10.4387 6.91448 10.2529 7.02222Z"
        fill="black"
      />
    </svg>
  );
};

export default PlayIcon;
