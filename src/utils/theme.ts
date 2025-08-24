import tokens from "@/components/lib/tokens";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  FONTS,
  LINE_HEIGHTS,
  SPACING,
} from "@/utils/constants";

// Enhanced Typography styles matching Figma design
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
// Enhanced Button styles matching Figma variants
export const BUTTON_STYLES = {
  primary: {
    enabled: {
      backgroundColor: tokens.colors.button.primary,
      borderColor: tokens.colors.button.primary,
      borderWidth: 1,
      borderRadius: tokens.borderRadius.lg,
    },
    hover: {
      backgroundColor: tokens.colors.button.primaryHover,
      borderColor: tokens.colors.button.primaryHover,
    },
    disabled: {
      backgroundColor: tokens.colors.button.primaryDisabled,
      borderColor: tokens.colors.button.primaryDisabled,
    },
  },
  secondary: {
    enabled: {
      backgroundColor: tokens.colors.button.secondary,
      borderColor: tokens.colors.primary[500],
      borderWidth: 1,
      borderRadius: tokens.borderRadius.lg,
    },
    hover: {
      backgroundColor: tokens.colors.button.secondaryHover,
    },
    disabled: {
      backgroundColor: tokens.colors.neutral[100],
      borderColor: tokens.colors.neutral[300],
    },
  },
  tertiary: {
    enabled: {
      backgroundColor: tokens.colors.button.tertiary,
      borderColor: "transparent",
      borderWidth: 0,
      borderRadius: tokens.borderRadius.lg,
    },
    hover: {
      backgroundColor: tokens.colors.button.tertiaryHover,
    },
    disabled: {
      backgroundColor: "transparent",
      opacity: 0.5,
    },
  },
  invisible: {
    enabled: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 0,
      borderRadius: tokens.borderRadius.lg,
    },
    hover: {
      backgroundColor: tokens.colors.neutral[50],
    },
    disabled: {
      backgroundColor: "transparent",
      opacity: 0.3,
    },
  },
  // Size variants
  sizes: {
    small: {
      paddingVertical: tokens.spacing[2],
      paddingHorizontal: tokens.spacing[3],
      minHeight: tokens.componentSizes.button.sm.height,
    },
    medium: {
      paddingVertical: tokens.spacing[3],
      paddingHorizontal: tokens.spacing[4],
      minHeight: tokens.componentSizes.button.base.height,
    },
    large: {
      paddingVertical: tokens.spacing[4],
      paddingHorizontal: tokens.spacing[5],
      minHeight: tokens.componentSizes.button.lg.height,
    },
  },
};

// Input styles matching Figma design
// Enhanced Input styles matching Figma variants
export const INPUT_STYLES = {
  variants: {
    normal: {
      inputted: {
        false: {
          backgroundColor: tokens.colors.input.background,
          borderColor: tokens.colors.input.border,
          borderWidth: 1,
          borderRadius: tokens.borderRadius.lg,
        },
        true: {
          backgroundColor: tokens.colors.input.background,
          borderColor: tokens.colors.input.border,
          borderWidth: 1,
          borderRadius: tokens.borderRadius.lg,
        },
      },
    },
    selected: {
      inputted: {
        false: {
          backgroundColor: tokens.colors.input.background,
          borderColor: tokens.colors.input.borderFocus,
          borderWidth: 2,
          borderRadius: tokens.borderRadius.lg,
        },
        true: {
          backgroundColor: tokens.colors.input.background,
          borderColor: tokens.colors.input.borderFocus,
          borderWidth: 2,
          borderRadius: tokens.borderRadius.lg,
        },
      },
    },
  },
  states: {
    default: {
      backgroundColor: tokens.colors.input.background,
      borderColor: tokens.colors.input.border,
      borderWidth: 1,
      borderRadius: tokens.borderRadius.lg,
      fontSize: tokens.typography.fontSize.base,
      fontFamily: tokens.typography.fontFamily.primary,
      color: tokens.colors.text.primary,
    },
    focused: {
      borderColor: tokens.colors.input.borderFocus,
      borderWidth: 2,
    },
    error: {
      borderColor: tokens.colors.input.borderError,
      borderWidth: 1,
    },
    disabled: {
      backgroundColor: tokens.colors.neutral[100],
      borderColor: tokens.colors.neutral[300],
      color: tokens.colors.text.disabled,
    },
  },
  sizes: {
    small: {
      paddingVertical: tokens.spacing[2],
      paddingHorizontal: tokens.spacing[3],
      minHeight: tokens.componentSizes.input.sm.height,
      fontSize: tokens.componentSizes.input.sm.fontSize,
    },
    medium: {
      paddingVertical: tokens.spacing[3],
      paddingHorizontal: tokens.spacing[3],
      minHeight: tokens.componentSizes.input.base.height,
      fontSize: tokens.componentSizes.input.base.fontSize,
    },
    large: {
      paddingVertical: tokens.spacing[4],
      paddingHorizontal: tokens.spacing[4],
      minHeight: tokens.componentSizes.input.lg.height,
      fontSize: tokens.componentSizes.input.lg.fontSize,
    },
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
