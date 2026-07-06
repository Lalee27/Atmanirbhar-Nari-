---
name: Aatmanirbhar Nari
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#56423b'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#89726a'
  outline-variant: '#dcc1b7'
  surface-tint: '#9d431b'
  primary: '#9d431b'
  on-primary: '#ffffff'
  primary-container: '#e87c4f'
  on-primary-container: '#5c1d00'
  inverse-primary: '#ffb599'
  secondary: '#1a686c'
  on-secondary: '#ffffff'
  secondary-container: '#a8eff3'
  on-secondary-container: '#236e72'
  tertiary: '#75584d'
  on-tertiary: '#ffffff'
  tertiary-container: '#b49286'
  on-tertiary-container: '#432c23'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb599'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#7d2c04'
  secondary-fixed: '#a8eff3'
  secondary-fixed-dim: '#8cd2d6'
  on-secondary-fixed: '#002021'
  on-secondary-fixed-variant: '#004f53'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#e4beb2'
  on-tertiary-fixed: '#2b160f'
  on-tertiary-fixed-variant: '#5b4137'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
  warm-bg: '#FDF9F3'
  success-green: '#2D6A4F'
  alert-gold: '#C68B16'
  terracotta-clay: '#B35A38'
typography:
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  button-text:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  touch-target-min: 48px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 64px
  stack-sm: 12px
  stack-md: 24px
---

## Brand & Style

The visual identity of the design system is anchored in **Inclusive Minimalism** with a **Tactile** influence. It is designed to be a supportive companion for women entrepreneurs, many of whom are navigating digital business tools for the first time. The brand personality is empathetic, professional, and deeply grounded in community.

The design style avoids complex abstractions or hidden interactions. Instead, it uses clear visual metaphors, large interactive surfaces, and a warm, inviting atmosphere. By combining high-contrast typography with a vibrant, earthy palette, the design system bridges the gap between traditional community values and modern digital entrepreneurship. It prioritizes low-bandwidth performance without sacrificing the "human" feel of the platform.

## Colors

The palette is inspired by natural pigments and dawn light, symbolizing new beginnings and growth.

- **Primary (Sunset Orange):** Used for primary actions, progress indicators, and key brand moments. It radiates energy and warmth.
- **Secondary (Deep Teal):** Provides the professional backbone of the system. Used for headers, navigation, and elements requiring high trust and stability.
- **Tertiary (Terracotta):** An earthy accent used to ground the vibrant orange, often appearing in category icons and decorative borders.
- **Background (Warm Cream):** Instead of a sterile white, `#FDF9F3` is used to reduce eye strain and provide a softer, more "paper-like" tactile quality.
- **Text (Charcoal Gray):** High-contrast charcoal ensures maximum readability for users with varying levels of visual acuity.

## Typography

The typography strategy prioritizes **Be Vietnam Pro** for its friendly, contemporary curves and exceptional legibility at larger sizes. It provides the "warmth" required for the brand identity. 

**Work Sans** is utilized for labels and buttons because its structured, neutral shapes provide the "professional" clarity needed for business management tasks. 

**Readability Standards:**
- Minimum body text size is 16px to accommodate first-time digital users.
- Line heights are generous (1.5x for body) to prevent text crowding.
- Headlines use a slightly tighter letter-spacing and bold weights to create a clear visual hierarchy.

## Layout & Spacing

The design system uses a **Fluid Grid** model with a mobile-first philosophy. The core spacing unit is **8px**, ensuring all elements align to a consistent rhythmic scale.

**Key Layout Rules:**
- **Mobile (Default):** 4-column layout with 20px margins. This is the primary experience.
- **Tablet/Desktop:** 12-column layout with a maximum content width of 1140px. 
- **Touch Targets:** A strict minimum of 48x48px for all interactive elements to ensure ease of use for those with less motor precision or on smaller devices.
- **White Space:** Generous vertical stacking (`stack-md`) is used between sections to prevent "information overload," which is critical for new digital users.

## Elevation & Depth

To remain **low-bandwidth friendly**, this design system avoids heavy blurs and complex gradients. Depth is conveyed through **Tonal Layers** and **Soft Inset Borders**.

- **Surface Levels:** The primary background is the lowest layer. Cards and containers use a pure white surface (`#FFFFFF`) to pop against the cream background.
- **Outlines:** Instead of shadows, use a 1px solid border in a very light earthy tone (`#E0D7CC`) to define card boundaries.
- **Active State:** When an element is pressed, it uses a subtle "pressed" effect—shifting its background color slightly darker rather than moving in Z-space. This keeps the rendering performance high on budget devices.

## Shapes

The shape language is **Rounded**, reflecting the approachable and community-centric nature of the platform.

- **Standard Elements:** Buttons, input fields, and small cards use a **0.5rem (8px)** corner radius.
- **Large Containers:** Profile cards and featured banners use a **1rem (16px)** radius to create a soft, friendly frame.
- **Icon Backdrops:** Category icons are placed within circles or "super-ellipses" to maintain a consistent organic feel.
- **Interactive Indicators:** Checkboxes and radio buttons should be slightly more rounded than standard geometric forms to feel less "technical."

## Components

### Buttons
- **Primary:** Solid Sunset Orange with white text. High contrast, bold weight.
- **Secondary:** Deep Teal outline with 2px width. Clear and professional.
- **Tertiary/Ghost:** Text-only with an underline, used for less frequent actions like "Cancel."

### Input Fields
- Labels are always visible (not floating) to maintain context.
- Heavy 2px borders when focused using the Deep Teal color to provide a clear "active" signal.
- Help text is positioned directly below the field in a 14px Work Sans font.

### Chips & Tags
- Used for business categories (e.g., "Tailoring", "Tiffin"). 
- Pill-shaped with a light tint of the Tertiary Terracotta background and dark text.

### Cards
- White background with a 1px Earthy outline.
- Image headers should have a 16:9 aspect ratio with top corners rounded.
- Padding inside cards is a minimum of 16px to ensure content doesn't feel cramped.

### Iconography
- **Style:** "Thick Stroke" (2px) icons with rounded caps. 
- Avoid thin, spindly icons that are hard to see on low-resolution screens. 
- Use icons as labels whenever possible to support users with lower literacy.