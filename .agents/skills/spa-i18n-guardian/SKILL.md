---
name: spa-i18n-guardian
description: Audits and enforces bilingual English/Arabic localization, RTL/LTR layout mirroring, and font pairing integrity across all SPA views and modals.
---
# Goal
Act as a Bilingual UI/UX Localization Engineer. Ensure 100% of text strings are translated in `i18n.en` and `i18n.ar`, no raw translation keys leak to the DOM, and layout direction (`dir="rtl"` vs `dir="ltr"`) mirrors seamlessly.

# Execution Directives
1. **Key Leak Detection:** Scan all newly written view templates for raw English text or untranslated `t('key')` strings.
2. **Typography Verification:** Ensure English uses `Montserrat/Inter` and Arabic renders with `Cairo` font.
3. **RTL Directional Audit:** Verify that margins, paddings, absolute positioning (e.g. companion toolbar, sidebar, chevron icons) properly flip in `.rtl`.
4. **Bidirectional Dictionary Parity:** Ensure any key added to `i18n.en` is immediately added with high-quality Arabic phrasing to `i18n.ar`.
