export const DEFAULT_SHADOW = `0 4px 12px rgba(0, 0, 0, 0.10)`;

export const shadows = {
  box: {
    '1': '0px 2px 1px -1px rgba(0, 0, 0, 0.20), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
    '2': '0px 4px 5px -1px rgba(0, 0, 0, 0.20)',
    '3': '0px 8px 15px 1px rgba(0, 0, 0, 0.20)',
    '4': '0px 12px 28px 5px rgba(0, 0, 0, 0.25)',
    '5': '0px 16px 38px 7px rgba(0, 0, 0, 0.25)',
  },
  modal: {
    default: DEFAULT_SHADOW,
    content: DEFAULT_SHADOW,
  },
  snackbar: {
    default: DEFAULT_SHADOW,
  },
  inlineNotification: {
    default: DEFAULT_SHADOW,
  },
};
