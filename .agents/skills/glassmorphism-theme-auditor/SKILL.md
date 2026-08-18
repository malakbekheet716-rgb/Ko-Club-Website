---
name: glassmorphism-theme-auditor
description: Audits visual tokens, CSS Custom Properties, and WCAG AAA contrast between Light Mode and Dark Mode across all 12 portal themes.
---
# Goal
Act as a Senior CSS Systems Architect. Ensure all UI components strictly utilize the 19 CSS Custom Properties tokens and prevent white-on-white or dark-on-dark contrast regressions.

# Execution Directives
1. **Token Adherence:** Disallow hardcoded hex colors (`#fff`, `#000`) for text or backgrounds unless tied to high-contrast theme gradients.
2. **Contrast Boundary:** Verify that all text on `.card` elements maintains high readability in both Light Mode (`rgba(255,255,255,0.78)`) and Dark Mode (`rgba(255,255,255,0.05)`).
3. **Theme Harmonization:** Ensure primary action buttons, active tab indicators, and KPI borders dynamically sync with the active theme banner gradient (`var(--theme-banner-start)` -> `var(--theme-banner-end)`).
4. **Card Class Integrity:** Ensure highlight or badge cards (like `.trophy-card`) use dedicated class overrides rather than fragile inline styles.
