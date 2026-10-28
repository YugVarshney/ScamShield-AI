/**
 * Groww-inspired Fintech Design System Palette.
 * Tailored for high-trust financial interfaces: crisp emerald greens, deep obsidian darks,
 * clean typography neutrals, and high-visibility fraud warning states.
 */

const tintColorLight = '#00B386'; // Groww primary emerald
const tintColorDark = '#00D09C';  // Groww vibrant emerald

export const Colors = {
  light: {
    text: '#111827',
    subtext: '#64748B',
    background: '#F8FAFC',
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    cardSubtle: '#F1F5F9',
    tint: tintColorLight,
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    success: '#00B386',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#2563EB',
    chipSafeBg: '#ECFDF5',
    chipWarningBg: '#FFFBEB',
    chipDangerBg: '#FEF2F2',
  },
  dark: {
    text: '#F8FAFC',
    subtext: '#94A3B8',
    background: '#0B0E14',
    card: '#141822',
    cardBorder: '#232A3B',
    cardSubtle: '#1C2230',
    tint: tintColorDark,
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
    success: '#00D09C',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#38BDF8',
    chipSafeBg: 'rgba(0, 208, 156, 0.12)',
    chipWarningBg: 'rgba(245, 158, 11, 0.12)',
    chipDangerBg: 'rgba(239, 68, 68, 0.14)',
  },
};

