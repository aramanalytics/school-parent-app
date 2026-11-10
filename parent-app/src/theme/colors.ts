// Parent App Design Tokens & Color Palette
export const colors = {
  primary: {
    navy: '#172554',
    royal: '#3B5BDB',
    royalLight: '#5C7CFA',
    royalDark: '#2B4AC7',
  },
  background: {
    main: '#F5F7FB',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
  },
  status: {
    success: '#16A36A',
    successLight: '#D3F9D8',
    warning: '#F2A93B',
    warningLight: '#FFF3BF',
    error: '#E03131',
    errorLight: '#FFE3E3',
    info: '#3B5BDB',
    infoLight: '#DBE4FF',
  },
  text: {
    primary: '#172033',
    secondary: '#64748B',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
  },
  border: {
    default: '#E2E8F0',
    light: '#F1F5F9',
  },
  attendance: {
    present: '#16A36A',
    absent: '#E03131',
    late: '#F2A93B',
    holiday: '#94A3B8',
  },
} as const;

