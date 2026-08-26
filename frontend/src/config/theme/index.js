// config/theme/index.js

import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import borderRadius from './borderRadius';
import shadows, { brandShadows } from './shadows';
import breakpoints from './breakpoints';
import animations from './animations';
import zIndex from './zIndex';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  brandShadows,
  breakpoints,
  animations,
  zIndex,
};

// Individual exports
export {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  brandShadows,
  breakpoints,
  animations,
  zIndex,
};

export default theme;