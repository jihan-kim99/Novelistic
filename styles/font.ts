import localFont from 'next/font/local';

export const pretendard = localFont({
  src: [
    {
      path: '../public/fonts/Pretendard-Black.subset.woff2',
      weight: '900',
    },
    {
      path: '../public/fonts/Pretendard-ExtraBold.subset.woff2',
      weight: '800',
    },
    {
      path: '../public/fonts/Pretendard-Bold.subset.woff2',
      weight: '700',
    },
    {
      path: '../public/fonts/Pretendard-SemiBold.subset.woff2',
      weight: '600',
    },
    {
      path: '../public/fonts/Pretendard-Medium.subset.woff2',
      weight: '500',
    },
    {
      path: '../public/fonts/Pretendard-Regular.subset.woff2',
      weight: '400',
    },
    {
      path: '../public/fonts/Pretendard-Light.subset.woff2',
      weight: '300',
    },
    {
      path: '../public/fonts/Pretendard-ExtraLight.subset.woff2',
      weight: '200',
    },
    {
      path: '../public/fonts/Pretendard-Thin.subset.woff2',
      weight: '100',
    },
  ],
  display: 'swap',
});

export const pretendardVariable = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  weight: '45 920',
  style: 'normal',
  display: 'swap',
});