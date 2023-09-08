//* this is the cycle of daytime
export const morning = ['#35D6ED', '#65DDEF', '#7AE5F5', '#97EBF4', '#C9F6FF'];
export const morningLight = '#ffffff';
export const evening = ['#fddbcf', '#7c70ad', '#fea06d', '#c697aa', '#4c508d'];
export const eveningLight = '#FFE8C6';
export const night = [
  '#070B34',
  '#141852',
  '#2B2F77',
  '#483475',
  '#6B4984',
  '#855988',
];
export const nightLight = '#584d9f';

//* Interpolated function
//? This function is used to interpolate the color of sunlight
export const interpolateColor = (timeOfDay: any) => {
  switch (true) {
    case timeOfDay >= 0 && timeOfDay < 8:
      return morningLight;
    case timeOfDay >= 8 && timeOfDay < 16:
      return eveningLight;
    default:
      return nightLight;
  }
};
//? This function is used to interpolate the position of sunlight
export const interpolatedSunPosition = (timeOfDay: any) => {
  switch (true) {
    case timeOfDay >= 0 && timeOfDay < 8:
      return 6;
    case timeOfDay >= 8 && timeOfDay < 16:
      return 0;
    default:
      return -6;
  }
};
//? This function is used to interpolate the color of sky
export const interpolatedTime = (timeOfDay: any) => {
  switch (true) {
    case timeOfDay >= 0 && timeOfDay < 8:
      return morning;
    case timeOfDay >= 8 && timeOfDay < 16:
      return evening;
    default:
      return night;
  }
};
