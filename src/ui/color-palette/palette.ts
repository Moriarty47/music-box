import quantize from '@lokesh.dhakar/quantize';

import { createPixelArray, validateOptions } from './utils';

import type { Color } from '@lokesh.dhakar/quantize';

/*
 * Color Thief v2.6.0
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 * License
 * -------
 * Copyright Lokesh Dhakar
 * Released under the MIT license
 * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
 *
 * @license
 */

export class CanvasImage {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  constructor(image: HTMLImageElement) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.width = this.canvas.width = image.naturalWidth;
    this.height = this.canvas.height = image.naturalHeight;
    this.ctx.drawImage(
      image,
      0,
      0,
      this.width,
      this.height,
    );
  }

  getImageData() {
    return this.ctx.getImageData(
      0,
      0,
      this.width,
      this.height,
    );
  }
}

export class ColorPalette {
  getPalette(sourceImage: HTMLImageElement, colorCount?: number, quality?: number) {
    const options = validateOptions({ colorCount, quality });

    const image = new CanvasImage(sourceImage);
    const imageData = image.getImageData();
    const pixelCount = image.width * image.height;

    const pixelArray = createPixelArray(imageData.data, pixelCount, options.quality);

    const cmap = quantize(pixelArray, options.colorCount);

    return cmap ? cmap.palette() : null;
  }

  getColor(sourceImage: HTMLImageElement, quality = 10) {
    const palette = this.getPalette(sourceImage, 5, quality);

    return palette?.[0] || null;
  }

  async getColorFromUrl(imageUrl: string, quality: number) {
    return new Promise<Color | null>((resolve, reject) => {
      const sourceImage = document.createElement('img');
      sourceImage.onload = () => {
        resolve(this.getColor(sourceImage, quality));
      };
      sourceImage.onerror = reject;
      sourceImage.src = imageUrl;
    });
  }

  async getImageData(imageUrl: string) {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', imageUrl, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = () => {
        if (xhr.status === 200) {
          const uInt8Array = new Uint8Array(xhr.response);
          const len = uInt8Array.length;
          const binaryString = Array.from({ length: len });
          for (let i = 0; i < len; i += 1) {
            binaryString[i] = String.fromCharCode(uInt8Array[i]);
          }
          const data = binaryString.join('');
          resolve(`data:image/png;base64,${window.btoa(data)}`);
        }
      };
      xhr.onerror = reject;
      xhr.send();
    });
  }
}
