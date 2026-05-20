---
name: Midnight Pro
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#ffb695'
  on-tertiary: '#571f00'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is engineered for high-performance professional environments, emphasizing clarity, depth, and focus. It targets a sophisticated user base that requires prolonged engagement with data and content without eye strain. 

The aesthetic is **Corporate Modern** with a lean towards **Technical Minimalism**. By utilizing a deep, monochromatic foundation punctuated by high-energy indigo accents, the system evokes a sense of reliability and cutting-edge precision. The visual language relies on logical grouping, ample negative space, and a refined hierarchy that guides the user through complex workflows with ease.

## Colors

The palette is optimized for dark mode legibility and depth perception. The primary indigo serves as the "action" color, used sparingly for high-priority interactions and brand signals. 

- **Background**: A deep navy (`#0F172A`) serves as the canvas, providing maximum contrast for text while maintaining a premium feel.
- **Surface/Secondary**: A slate blue (`#1E293B`) defines containers, cards, and navigation elements, creating a clear physical distinction from the background.
- **Primary**: Indigo (`#4F46E5`) is the functional highlight, used for primary buttons, active states, and focus indicators.
- **Text/On-Surface**: Off-white (`#F8FAFC`) ensures peak readability without the harshness of pure white against a dark backdrop.

## Typography

This design system utilizes **Inter** exclusively to leverage its exceptional legibility and systematic weight distribution. 

The typographic scale is built on a 4px baseline grid. Headlines use tighter letter-spacing and heavier weights to command attention, while body text maintains a standard tracking to ensure comfort during long-form reading. For mobile devices, large headlines scale down to prevent awkward line breaks while maintaining their weight-based hierarchy. Use the semi-bold (600) weight for interactive labels to distinguish them from static body text.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. A strict 8px spatial rhythm governs all padding and margins to maintain visual consistency.

- **Desktop**: Content is typically contained within a max-width of 1280px. Columns are separated by 16px gutters.
- **Mobile**: Uses 16px side margins to maximize screen real estate.
- **Vertical Spacing**: Stacked elements should follow the 8px increments (e.g., 16px between related items, 32px between distinct sections).

Alignment should be primarily left-aligned to accommodate the natural "F-pattern" of scanning digital interfaces.

## Elevation & Depth

Depth in the design system is communicated through **Tonal Layering** and **Low-Contrast Outlines**. 

Instead of heavy shadows which can appear "muddy" in dark themes, we use the slate blue surface color to pull elements forward against the navy background. To further define hierarchy:
1. **Level 0 (Background)**: Deep Navy (`#0F172A`) for the lowest application surface.
2. **Level 1 (Surface)**: Slate Blue (`#1E293B`) for cards, sidebars, and navigation headers.
3. **Overlays**: For modals and menus, use a slightly lighter version of the surface color with a 1px border (`#334155`) and a subtle, large-radius shadow (24px blur, 10% opacity black) to simulate height.

Backdrop blurs (20px) should be used on sticky navigation bars to maintain context as content scrolls beneath.

## Shapes

The design system follows a **Rounded** philosophy to soften the technical nature of the dark color palette. 

Standard UI elements (buttons, input fields) use a 0.5rem (8px) radius. Larger containers like cards and modals utilize a 1rem (16px) radius to create a distinct, modern enclosure. This consistency in rounding helps unify disparate components and makes the interface feel more approachable and ergonomic.

## Components

The component library prioritizes high-contrast interaction states and clear affordances:

- **Buttons**: Primary buttons are solid Indigo (`#4F46E5`) with white text. Secondary buttons use a Slate Blue ghost style with a 1px border.
- **Input Fields**: Backgrounds use the deep navy to create an "inset" feel against the slate surface. Focus states must trigger a 2px indigo border.
- **Cards**: Use the Slate Blue surface with 16px internal padding. Avoid borders unless cards are placed on a background of the same color.
- **Chips**: Small, 4px rounded elements with a subtle `#334155` background for metadata or tags.
- **Lists**: Use 1px slate separators between items. Hover states should lighten the background of the list item by 5% to indicate interactivity.
- **Checkboxes/Radios**: Indigo fills for active states, using the off-white color for the checkmark/dot to ensure visibility.

Data density should be high but never cramped, ensuring each component has enough "breathing room" defined by the 8px spacing scale.