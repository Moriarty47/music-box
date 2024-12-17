import ColorPalette from '@/ui/color-palette';

export const colorPalette = new ColorPalette();

export const getColorsFromImage = (image: HTMLImageElement) => {
  const mainColor = colorPalette.getColor(image);
  const palette = colorPalette.getPalette(image, 3);

  const colors = {
    start: mainColor || [75, 75, 75],
    end: [255, 91, 91],
  };

  colors.end = getMaxEuclideanDistanceColor(colors.start, palette?.length ? palette : [colors.end]);

  const colorToString = ([r, g, b]: number[]) => `rgb(${r},${g},${b})`;

  return {
    start: colorToString(colors.start),
    end: colorToString(colors.end),
  };
};

function getMaxEuclideanDistanceColor(main: number[], palette: number[][]) {
  let maxDistance = -1;
  let color = palette[0];

  for (let i = 0, len = palette.length; i < len; i += 1) {
    const c = palette[i];
    const distance = Math.sqrt((main[0] - c[0]) ** 2 + (main[1] - c[1]) ** 2 + (main[2] - c[2]) ** 2);
    if (distance > maxDistance) {
      maxDistance = distance;
      color = c;
    }
  }

  return color;
}
