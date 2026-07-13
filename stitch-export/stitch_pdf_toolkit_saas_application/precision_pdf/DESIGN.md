---
name: Precision PDF
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#424754'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for a premium, high-utility SaaS environment. It blends the structural clarity of Notion with the refined aesthetic of Apple and the technical precision of Linear. The personality is "Quietly Powerful"—it prioritizes the user's documents over the interface itself.

The style is **Elevated Minimalism**. It utilizes heavy whitespace to reduce cognitive load during complex document workflows. The interface feels fast and lightweight, using subtle glassmorphism to provide context and depth without distracting from the primary task. The emotional response is one of total control, privacy, and professional reliability.

## Colors

The palette is anchored by a neutral-cool foundation to ensure the interface recedes into the background. 

- **Primary Blue (#3B82F6):** Used sparingly for primary actions and active states to guide focus.
- **Surface Neutrals:** The background uses #F9FAFB to provide a softer, more premium feel than pure white, while pure white (#FFFFFF) is reserved for cards and elevated surfaces to create a natural hierarchy.
- **Semantic Colors:** Success (Green), Warning (Amber), and Error (Red) follow standard SaaS conventions but are desaturated slightly to maintain the sophisticated aesthetic.

## Typography

This design system uses a dual-font approach. **Geist** provides a technical, precise feel for headings and UI labels, mirroring the precision of PDF editing. **Inter** is utilized for body copy and long-form text to ensure maximum readability and a familiar, professional tone.

Headings should use tight letter-spacing (-0.02em) to appear more "designed" and high-end. Paragraph text maintains standard tracking for optimal legibility.

## Layout & Spacing

The layout follows a **fluid grid** model with a maximum container width of 1280px for desktop productivity. A strict 4px baseline grid ensures vertical rhythm.

- **Desktop:** 12-column grid with 24px gutters. Use generous 40px outer margins to create a "contained" feel.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters and 16px margins.

Spacing should favor "Macro-white space"—extra padding between distinct functional sections (32px+)—while keeping related UI controls tightly grouped (8px or 12px) to signify relationship.

## Elevation & Depth

Depth is communicated through three specific layers:

1.  **The Canvas (Base):** #F9FAFB. The lowest layer.
2.  **The Surface (Cards/Sections):** Pure #FFFFFF with a 1px border (#E5E7EB) and a very soft, diffused shadow.
3.  **The Floating Layer (Modals/Popovers):** Pure white with a 12% backdrop blur (glassmorphism) when overlapping content.

**Shadows:** Shadows are highly diffused and low-opacity.
- *Default:* `0 1px 3px rgba(0,0,0,0.02), 0 4px 6px rgba(0,0,0,0.03)`
- *Elevated (Hover/Modals):* `0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)`

## Shapes

The shape language is modern and approachable. All standard UI components (buttons, inputs, cards) use a 12px (`0.75rem`) corner radius. 

Larger containers like document previews or main content areas use 16px to 24px radii. Icons and small tags use a 6px radius to maintain a consistent aesthetic scale. Avoid pure circles (pill-shapes) except for status indicators or specific toggle switches.

## Components

### Buttons
- **Primary:** Solid #3B82F6 with white text. Subtle inner-glow on top edge for a tactile feel.
- **Secondary:** White background, 1px border (#E5E7EB), text #111827.
- **Ghost:** No background or border, text #4B5563. Used for utility actions.

### Navigation
The side navigation uses a subtle semi-transparent background (Blur: 10px) with a light gray border-right. Active items use a soft gray background highlight (#F3F4F6) and a 2px blue vertical indicator.

### Input Fields
Inputs are white with a 1px border (#E5E7EB). On focus, the border turns #3B82F6 with a 3px soft blue outer glow (box-shadow). Labels are always positioned above the field in `label-md` style.

### Document Cards
Used for file management. Feature a large thumbnail preview, 1px border, and metadata in `body-md`. On hover, the card should lift slightly using the "Elevated" shadow profile.

### Chips & Tags
Small, 6px rounded corners, using desaturated versions of semantic colors (e.g., light blue background with dark blue text) for status indicators like "Processed" or "Draft."