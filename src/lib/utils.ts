import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cva(
  base?: ClassValue,
  config?: {
    variants?: Record<string, Record<string, ClassValue>>;
    compoundVariants?: Array<
      Record<string, unknown> & {
        class: ClassValue;
      }
    >;
    defaultVariants?: Record<string, unknown>;
  }
) {
  return (props?: Record<string, unknown>) => {
    if (config?.variants == null) return cn(base);

    const { variants, defaultVariants } = config;

    const getVariantClassNames = Object.keys(variants).map((variant: string) => {
      const variantProp = props?.[variant];
      const defaultVariantProp = defaultVariants?.[variant];

      if (variantProp === null) return null;

      const variantKey = (variantProp || defaultVariantProp) as string;

      return variants[variant][variantKey];
    });

    const compoundVariants =
      config?.compoundVariants?.reduce(
        (acc, compoundVariant: Record<string, unknown> & { class: ClassValue }) => {
          const { class: cvClass, ...compoundVariantOptions } = compoundVariant;

          if (
            Object.entries(compoundVariantOptions).every(([key, value]) => {
              return Array.isArray(value) ? value.includes(props?.[key]) : props?.[key] === value;
            })
          ) {
            acc.push(cvClass);
          }
          return acc;
        },
        [] as ClassValue[]
      ) ?? [];

    return cn(base, getVariantClassNames, compoundVariants);
  };
}
