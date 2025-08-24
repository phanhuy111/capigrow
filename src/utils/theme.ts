import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  FONTS,
  LINE_HEIGHTS,
  SPACING,
} from "@/utils/constants";

// Typography styles matching Figma design
export const TYPOGRAPHY = {
  // Headings
  h1: {
    fontFamily: FONTS.bold,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.xxxxxxl,
    lineHeight: LINE_HEIGHTS.xxxxxxl,
    color: COLORS.textPrimary,
  },
  h2: {
    fontFamily: FONTS.bold,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.xxxxxl,
    lineHeight: LINE_HEIGHTS.xxxxxl,
    color: COLORS.textPrimary,
  },
  h3: {
    fontFamily: FONTS.semiBold,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: FONT_SIZES.xxxxl,
    lineHeight: LINE_HEIGHTS.xxxxl,
    color: COLORS.textPrimary,
  },
  h4: {
    fontFamily: FONTS.semiBold,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: FONT_SIZES.xxxl,
    lineHeight: LINE_HEIGHTS.xxxl,
    color: COLORS.textPrimary,
  },
  h5: {
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.xxl,
    lineHeight: LINE_HEIGHTS.xxl,
    color: COLORS.textPrimary,
  },
  h6: {
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.xl,
    lineHeight: LINE_HEIGHTS.xl,
    color: COLORS.textPrimary,
  },

  // Body text
  bodyLarge: {
    fontFamily: FONTS.regular,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.lg,
    lineHeight: LINE_HEIGHTS.lg,
    color: COLORS.textPrimary,
  },
  bodyMedium: {
    fontFamily: FONTS.regular,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.md,
    lineHeight: LINE_HEIGHTS.md,
    color: COLORS.textPrimary,
  },
  bodySmall: {
    fontFamily: FONTS.regular,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS.sm,
    color: COLORS.textSecondary,
  },

  // Labels
  labelLarge: {
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.md,
    lineHeight: LINE_HEIGHTS.md,
    color: COLORS.textPrimary,
  },
  labelMedium: {
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS.sm,
    color: COLORS.textPrimary,
  },
  labelSmall: {
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS.xs,
    color: COLORS.textSecondary,
  },

  // Captions
  caption: {
    fontFamily: FONTS.regular,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: FONT_SIZES.xs,
    lineHeight: LINE_HEIGHTS.xs,
    color: COLORS.textTertiary,
  },

  // Button text
  buttonLarge: {
    fontFamily: FONTS.semiBold,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: FONT_SIZES.lg,
    lineHeight: LINE_HEIGHTS.lg,
  },
  buttonMedium: {
    fontFamily: FONTS.semiBold,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: FONT_SIZES.md,
    lineHeight: LINE_HEIGHTS.md,
  },
  buttonSmall: {
    fontFamily: FONTS.medium,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS.sm,
  },
};

// Button styles matching Figma design
export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xxxl,
  },
  secondary: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xxxl,
  },
  tertiary: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xxxl,
  },
  invisible: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
};

// Input styles matching Figma design
export const INPUT_STYLES = {
  default: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  focused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  disabled: {
    backgroundColor: COLORS.gray100,
    borderColor: COLORS.borderLight,
    color: COLORS.textDisabled,
  },
};

// Card styles matching Figma design
export const CARD_STYLES = {
  default: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  elevated: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  flat: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
};

// Icon sizes
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 40,
  xxxxl: 48,
};

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
};

// Z-index values
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
};

// Export individual items for named imports
export { COLORS, FONTS, FONT_WEIGHTS, FONT_SIZES, LINE_HEIGHTS, SPACING, BORDER_RADIUS };

export default {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  buttons: BUTTON_STYLES,
  inputs: INPUT_STYLES,
  cards: CARD_STYLES,
  icons: ICON_SIZES,
  animation: ANIMATION,
  zIndex: Z_INDEX,
};
