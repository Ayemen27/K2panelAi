/**
 * Typography Design System
 * 
 * Defines typography tokens and utility types for consistent text styling
 * across all components using Tailwind CSS classes.
 */

/**
 * Typography variant types
 */
export type TypographyVariant = 
  | 'display-xl'
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'headline-xl'
  | 'headline-lg'
  | 'headline-md'
  | 'headline-sm'
  | 'body-xl'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'caption-lg'
  | 'caption-md'
  | 'caption-sm';

/**
 * Typography token configuration
 * Maps variant names to Tailwind CSS classes
 */
export const typography = {
  display: {
    xl: 'text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none',
    lg: 'text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none',
    md: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight',
    sm: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight',
  },
  headline: {
    xl: 'text-3xl md:text-4xl font-semibold tracking-tight leading-tight',
    lg: 'text-2xl md:text-3xl font-semibold tracking-tight leading-tight',
    md: 'text-xl md:text-2xl font-semibold tracking-tight leading-snug',
    sm: 'text-lg md:text-xl font-semibold tracking-tight leading-snug',
  },
  body: {
    xl: 'text-xl md:text-2xl font-normal leading-relaxed',
    lg: 'text-lg md:text-xl font-normal leading-relaxed',
    md: 'text-base md:text-lg font-normal leading-relaxed',
    sm: 'text-sm md:text-base font-normal leading-relaxed',
  },
  caption: {
    lg: 'text-base font-medium leading-normal',
    md: 'text-sm font-medium leading-normal',
    sm: 'text-xs font-medium leading-normal',
  },
} as const;

/**
 * Typography utility type for component props
 * Use this to add typography variant prop to your components
 * 
 * @example
 * ```tsx
 * interface HeadingProps extends TypographyProps {
 *   children: React.ReactNode;
 * }
 * 
 * function Heading({ variant = 'headline-lg', className, children }: HeadingProps) {
 *   return (
 *     <h2 className={cn(getTypographyClass(variant), className)}>
 *       {children}
 *     </h2>
 *   );
 * }
 * ```
 */
export interface TypographyProps {
  variant?: TypographyVariant;
  className?: string;
}

/**
 * Get Tailwind classes for a typography variant
 * 
 * @param variant - The typography variant to use
 * @returns Tailwind CSS classes as a string
 * 
 * @example
 * ```tsx
 * const classes = getTypographyClass('headline-lg');
 * // Returns: 'text-2xl md:text-3xl font-semibold tracking-tight leading-tight'
 * ```
 */
export function getTypographyClass(variant: TypographyVariant): string {
  const [category, size] = variant.split('-');
  
  if (category === 'display') {
    return typography.display[size as keyof typeof typography.display];
  } else if (category === 'headline') {
    return typography.headline[size as keyof typeof typography.headline];
  } else if (category === 'body') {
    return typography.body[size as keyof typeof typography.body];
  } else if (category === 'caption') {
    return typography.caption[size as keyof typeof typography.caption];
  }
  
  return '';
}

/**
 * Font family tokens
 * Define available font families for the design system
 */
export const fontFamily = {
  sans: 'var(--font-ibm-plex-sans)',
  mono: 'var(--font-geist-mono)',
  display: 'var(--font-ibm-plex-sans)',
} as const;

/**
 * Font weight tokens
 * Semantic font weight values
 */
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/**
 * Line height tokens
 * Semantic line height values
 */
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

/**
 * Letter spacing tokens
 * Semantic letter spacing values
 */
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;
