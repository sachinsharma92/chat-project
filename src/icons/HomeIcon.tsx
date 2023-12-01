import { SVGProps } from 'react';

const HomeIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      {...props}
    >
      <path
        d="M0 7.875V16.375C0 16.9273 0.447715 17.375 1 17.375H6V11.875C6 11.5989 6.22386 11.375 6.5 11.375H9.5C9.77614 11.375 10 11.5989 10 11.875V17.375H15C15.5523 17.375 16 16.9273 16 16.375V7.875C16 6.93073 15.5554 6.04156 14.8 5.475L8.6 0.825C8.24444 0.558333 7.75556 0.558333 7.4 0.825L1.2 5.475C0.444583 6.04156 0 6.93073 0 7.875Z"
        fill="black"
      />
    </svg>
  );
};

export default HomeIcon;
