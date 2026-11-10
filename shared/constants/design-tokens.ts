// Shared design tokens used by both parent-app and admin-dashboard
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
    focus: '#3B5BDB',
  },
  attendance: {
    present: '#16A36A',
    absent: '#E03131',
    late: '#F2A93B',
    holiday: '#64748B',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

