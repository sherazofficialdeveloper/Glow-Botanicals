// config/theme/zIndex.js

export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',

  // Semantic z-index values
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modalBackdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
  toast: '1080',
  overlay: '1090',
  loader: '1100',
  max: '9999',
};

export const zIndexMap = {
  // Layout
  header: zIndex[40],
  sidebar: zIndex[30],
  footer: zIndex[10],
  backdrop: zIndex[40],

  // Components
  dropdown: zIndex.dropdown,
  modal: zIndex.modal,
  modalBackdrop: zIndex.modalBackdrop,
  toast: zIndex.toast,
  tooltip: zIndex.tooltip,
  popover: zIndex.popover,
  loader: zIndex.loader,

  // Overlays
  overlay: zIndex.overlay,
  mobileMenu: zIndex[50],
  cartDrawer: zIndex[50],
  searchModal: zIndex[50],
};

export default zIndex;