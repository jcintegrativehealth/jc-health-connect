# JC Integrative Health — Email Templates

Presentational React Email components. **No sending logic here** — wiring to
Resend (or another provider) is Claude Code's responsibility.

## Palette & type

- Verde Floresta `#1F3D2E` · Verde Sálvia `#436B52` · Verde Suave `#A7C4BC`
- Bege Claro `#F0EDE5` · Off-White `#FAF7F2`
- Terracota Suave `#C47D5A` (accent rules, eyebrows)
- Crimson Pro (serif headings) · Public Sans / system stack (body)

Body background is forced to `#ffffff` for maximum email-client compatibility;
the framed card uses the paper tone.

## Files

| File | Trigger |
|---|---|
| `_layout.tsx` | Shared masthead + footer + typography tokens. Compose every new template from `EmailLayout` + `styles`. |
| `welcome.tsx` | New patient completed portal signup. |
| `appointment-request-received.tsx` | `/book` submission acknowledged (not yet confirmed). |
| `appointment-confirmed.tsx` | Clinic scheduled the visit. |
| `appointment-reminder.tsx` | ~24h before the visit. |
| `contact-confirmation.tsx` | `/contact` form auto-reply. |
| `password-reset.tsx` | Portal or admin password reset. |

## Rendering to HTML (for Claude Code)

```ts
import { render } from "@react-email/render";
import { WelcomeEmail } from "@/lib/email-templates/welcome";

const html = await render(<WelcomeEmail firstName="Emily" />);
// then pass `html` to Resend's /emails endpoint
```

## Adding a new template

1. Create `src/lib/email-templates/<kebab-name>.tsx`.
2. `import { EmailLayout, styles } from "./_layout";`
3. Export a named React component + a Props interface.
4. Keep copy short, use the `detailCard` block for structured data, and pair
   the primary CTA with an optional secondary (`styles.ctaPrimary` /
   `styles.ctaSecondary`).
5. Never inline HIPAA/PHI data in `preview` text — it appears in inbox previews.

## Language

v1 is English only. Multi-language variants (ES/PT/ZH) will follow the same
component pattern, gated by a `locale` prop.
