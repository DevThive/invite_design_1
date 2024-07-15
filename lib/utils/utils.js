// /Users/donghalee/Dev/k_nori/invite_design_1/lib/utils/utils.js

/**
 * Creates an image element from a source.
 *
 * @param {string} src - The source of the image.
 */
export const createImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Needed to avoid cross-origin issues on CodeSandbox
    image.src = src;
  });

/**
 * Converts degrees to radians.
 *
 * @param {number} degree - The degree value to be converted.
 */
export const getRadianAngle = (degree) => (degree * Math.PI) / 180;
