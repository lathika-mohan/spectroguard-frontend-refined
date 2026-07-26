# Interactive 3D Robot Frontend - Design Philosophy

## Reference Design
This project replicates the **Interactive 3D Robot** component from 21st.dev (Spline Scene by Serafim). The design showcases a premium, dark-themed hero section with an embedded 3D robot model that responds to mouse movement.

## Chosen Approach: Dark Minimalist with Interactive 3D Focus

### Design Movement
**Contemporary Tech Minimalism** — A sophisticated blend of dark elegance with interactive 3D visualization. Inspired by premium SaaS landing pages and interactive design studios.

### Core Principles
1. **Dark Dominance**: Deep black/charcoal background creates focus and drama around the 3D model
2. **Spotlight Drama**: Strategic lighting effect (Spotlight component) creates depth and visual hierarchy
3. **Gradient Typography**: Text uses subtle gradients for visual interest without clutter
4. **Responsive Balance**: Left text content, right 3D visualization creates asymmetric equilibrium

### Color Philosophy
- **Primary Background**: `#000000` (pure black) — maximizes 3D model contrast
- **Text Gradient**: `from-neutral-50 to-neutral-400` — creates depth and visual sophistication
- **Spotlight**: White fill with strategic positioning for dramatic effect
- **Accent**: Subtle grays for secondary text and UI elements

### Layout Paradigm
**Asymmetric Split Layout**: 
- Left side: Text content with hierarchy (headline, description)
- Right side: Full-height 3D Spline scene
- Spotlight effect positioned to create visual flow from text toward 3D model

### Signature Elements
1. **Spotlight Effect**: Radial gradient overlay creating depth and focus
2. **Gradient Text**: Hero headline with gradient text effect
3. **3D Interactive Robot**: Center-right positioned, responds to mouse movement
4. **Dark Card Container**: Subtle border, rounded corners, overflow hidden

### Interaction Philosophy
- **Mouse Tracking**: 3D robot responds to cursor position (implemented via Spline's built-in mouse interaction)
- **Smooth Animations**: Subtle entrance animations for text elements
- **Responsive Behavior**: Layout adapts to mobile (stacked) and desktop (side-by-side)

### Animation Guidelines
- Text entrance: Fade-in + slight upward movement (300ms ease-out)
- Spotlight: Subtle glow pulse (2-3s infinite, very subtle)
- 3D Model: Continuous subtle rotation when idle, responsive to mouse when moving
- Transitions: All interactive elements use 200-300ms ease-out timing

### Typography System
- **Headline**: `text-4xl md:text-5xl font-bold` — Bold, commanding presence
- **Body Text**: `text-neutral-300` — Readable, secondary hierarchy
- **Font Stack**: System fonts (Tailwind default) for performance and clarity

### Brand Essence
**"Bring your UI to life with beautiful 3D scenes. Create immersive experiences that capture attention and enhance your design."**

**Personality Adjectives**: Sophisticated, Interactive, Immersive

### Brand Voice
- Headlines: Bold, aspirational, tech-forward
- CTAs: Action-oriented, clear value proposition
- Microcopy: Concise, professional, no corporate jargon
- Example: "Interactive 3D" (not "Welcome to our 3D Experience")

### Signature Brand Color
**Deep Black (#000000)** — The unmistakable foundation that makes the 3D model shine

### Wordmark & Logo
A bold geometric robot head icon (stylized, minimalist) on transparent background — represents the 3D focus and tech-forward nature.

## Implementation Notes
- Use `@splinetool/react-spline` for 3D scene integration
- Use `framer-motion` for entrance animations
- Use `lucide-react` for any icons needed
- Spotlight component from shadcn/ui (if available) or custom implementation
- Ensure mobile responsiveness with Tailwind breakpoints
