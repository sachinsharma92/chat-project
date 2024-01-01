import localFont from 'next/font/local';

export const atlasGrotesk = localFont({
  display: 'swap',
  variable: '--font-primary',
  src: [
    {
      path: '../../public/fonts/AtlasGrotesk-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AtlasGrotesk-Light.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AtlasGrotesk-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AtlasGrotesk-Medium.otf',
      weight: '500',
      style: 'normal',
    },
  ],
});
