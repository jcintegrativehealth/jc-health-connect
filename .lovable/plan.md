
# JC Integrative Health — Frontend Plan

Direção visual escolhida: **Academic Clinical Institute** (v2). Paleta navy/teal/gold, tipografia Crimson Pro (serif) + Public Sans (sans), seções numeradas com muito espaço em branco, matriz de serviços em navy, radar de inovação em linhas, e cards editoriais de insights.

Como o escopo pedido é gigantesco (60+ páginas), a Fase 1 entrega tudo o que foi listado no bloco "Primeira entrega" do briefing, com polimento alto. Páginas individuais de serviços/condições/legais adicionais entram em fases seguintes usando o mesmo template.

## Escopo Fase 1

### Fundação
- Design system em `src/styles.css`: tokens navy `#0D1B2A`, academic `#1B263B`, teal `#2A9D8F`, gray `#E9ECEF`, soft-white `#F8F9FA`, gold `#C9A227`. Fontes carregadas via `<link>` no `__root.tsx`.
- Componentes reutilizáveis: Button, Input, Select, Card, ArticleCard, PhysicianCard, ResearchCard, Badge, Tabs, Accordion, Modal, Drawer, Toast, Pagination, Breadcrumbs, EmptyState, LoadingSkeleton, DisclaimerBlock, ConsentCheckbox.
- Header institucional fixo + utility bar (idiomas + Patient Portal) + Book Appointment CTA. Mobile: drawer lateral.
- Footer robusto com colunas Care/Services/Research/Insights/Innovation/Patient Resources/Legal/Contact + newsletter + social discretos.
- Seletor de idioma EN/ES/PT/ZH: **estrutura i18n com react-i18next**, EN como default, dicionário completo apenas em EN + strings-chave traduzidas em ES/PT/ZH na Home/Header/Footer como demonstração. Restante fica pronto para tradução.

### Páginas de conteúdo
- **Home** — hero centrado + trust strip + 4 pilares + services matrix navy + Dr. Chen intro discreta + care options + innovation radar preview + medical insights editorial + guest physicians row + patient journey + newsletter + final CTA.
- **About** — Mission, Vision, Clinical Philosophy, Evidence-Based Integrative Care, Prevention & Longevity, Medical Innovation, Multilingual Care, Locations, Commitment to Education & Research.
- **Dr. Jason Chen** — introdução profissional, filosofia clínica, papel acadêmico, áreas de interesse, publicações (placeholder), idiomas, estados atendidos, inquiries. Sem credenciais inventadas.
- **Services** — overview com todos os 18 serviços + template individual reutilizável (Integrative Medicine como demo) com Overview / Who this helps / Common concerns / Our approach / What to expect / Related research / FAQ / CTA. Roteamento dinâmico `/services/$slug` renderizando o template a partir de mock data.
- **Conditions** — index com todos os itens listados + template `/conditions/$slug` educacional com disclaimer.
- **Research Hub** — biblioteca com filtros (topic/author/specialty/type/year/language) + tipos de conteúdo + `/research/$slug` com abstract, key findings, clinical context, evidence type, limitations, references, tags, related, comments (Clinical Discussion) com reações Helpful/Insightful/Well-Referenced + estados de moderação.
- **Medical Insights** — revista editorial com featured, latest, most read, editor's selection, trending, collections, autores, busca, filtros. Template de artigo compartilhado.
- **Medical Innovation** — Technology Radar completo com status Available Now / Emerging / In Trials / Experimental, cards de tecnologia com evidence level, e subseções (Devices, Wearables, AI, Digital Health, New Medications, Clinical Trials, Precision Medicine, Future of Health).
- **Guest Physicians** — index + `/physicians/$slug` profile + fluxo visual de convite (7 estados) + Apply/Request Invitation form.
- **Patient Resources** — hub com New Patients, Preparing for Your Visit, Insurance & Payment, Telehealth Guide, Forms, FAQ, Education, Downloads, Medical Records Request, Prescription Refill, Urgent Info.
- **Telehealth** — página informativa + interface visual de sala de espera (device check, camera preview, mic check, consent, Join Visit) — puramente visual.
- **Locations** — Colorado, Washington, Telehealth pages com placeholders de endereço.
- **FAQ** — completa com todas as categorias listadas em accordion.
- **Contact** — form com categorias/campos completos + cards de contato + disclaimer de não-emergência.
- **Legal** — Privacy Policy, Terms of Use, HIPAA, Accessibility, Medical Disclaimer, Telehealth Consent, Cookie Preferences, Research Disclaimer, Comment Policy, Community Guidelines com placeholders claramente identificados.

### Fluxos
- **Appointment Booking** (`/book`) — wizard 10 etapas: Visit Type → In-Person/Telehealth → State → Language → Service → Date → Time → Patient Info → Review → Confirmation. Calendar elegante, horários mock, estados empty/loading/success/error. Não persiste nada.
- **Patient Portal mockup** (`/portal`) — Login, Forgot Password, Dashboard (welcome + next appointment + care plan progress + pending forms + recent documents + messages + reminders), Upcoming/History, Health Plans, Documents, Lab Results, Messages, Billing, Forms, Profile, Language Prefs, Notifications, Privacy Settings. Banner "Demo data — not real medical records" visível.
- **Admin mockup** (`/admin`) — Dashboard, Content Management, Articles, Research, Physicians, Guest Contributors, Comments/Moderation, Appointments, Contact Messages, Newsletter, Media Library, Services, Conditions, Innovation Radar, Medications, Users, Roles, Settings, SEO, Analytics preview. Sidebar shadcn colapsável, dados mockados.
- **Global Search** — overlay com sugestões, buscas recentes, filtros por tipo, no-results state.

### Qualidade e infra
- SEO: `head()` por rota com title/description/og/twitter distintos; JSON-LD MedicalClinic no `__root`, Physician no perfil do Dr. Chen, Article nos posts, FAQPage no FAQ, BreadcrumbList em rotas profundas. Estrutura hreflang preparada.
- Acessibilidade: contraste OK com tokens semânticos, foco visível, labels em formulários, hierarquia H1 única por rota, alt text, teclado em drawers/modais (Radix).
- Responsivo desktop/laptop/tablet/mobile: menu drawer, wizard de booking em stepper vertical, cards empilhados, CTAs 44px+.
- Todos os dados via arquivos `src/data/*.ts` mockados (services, conditions, articles, research, physicians, innovation, medications, appointments, portal, admin).

## Detalhes técnicos

- TanStack Start file-based routing sob `src/routes/`. Estrutura plana com dots (`services.index.tsx`, `services.$slug.tsx`, `research.$slug.tsx`, etc.). `_authenticated` layout **não** será usado — portal e admin são mockups públicos com aviso de demo.
- `src/routes/index.tsx` substitui o placeholder pela nova Home.
- Novo layout: `__root.tsx` mantém `<Outlet />` e ganha header/footer wrappers via componentes; utility bar + language switcher.
- react-i18next: `src/i18n/index.ts` com detecção via localStorage, dicionários em `src/i18n/locales/{en,es,pt,zh}.json`. EN completo, outros com chaves demo. `<ClientOnly>` não é necessário — i18next é SSR-safe com fallback.
- Componentes shadcn existentes reutilizados. Novos primitivos custom para ArticleCard/ResearchCard/InnovationRow/PhysicianCard em `src/components/`.
- Imagens hero e cards geradas via imagegen (clínica moderna, laboratório, wearables, ambiente acadêmico) e salvas em `src/assets/`. Dr. Chen: retrato profissional discreto placeholder.
- Fontes Crimson Pro + Public Sans + JetBrains Mono via Google Fonts `<link>` em `__root.tsx`.
- Nenhum backend, DB, auth ou pagamento. Formulários mostram estado de sucesso mock ao enviar.

## Estrutura de arquivos (resumo)

```text
src/
  routes/
    __root.tsx (header + footer + i18n provider)
    index.tsx (Home)
    about.tsx
    dr-chen.tsx
    services.index.tsx
    services.$slug.tsx
    conditions.index.tsx
    conditions.$slug.tsx
    research.index.tsx
    research.$slug.tsx
    insights.index.tsx
    insights.$slug.tsx
    innovation.tsx
    medications.tsx
    physicians.index.tsx
    physicians.$slug.tsx
    patient-resources.tsx
    telehealth.tsx
    locations.$state.tsx
    faq.tsx
    contact.tsx
    book.tsx (wizard)
    portal.* (login, dashboard, appointments, etc.)
    admin.* (dashboard, content, users, etc.)
    legal.$slug.tsx
  components/
    layout/ (Header, Footer, UtilityBar, LanguageSwitcher, MobileNav)
    ui-ext/ (ArticleCard, ResearchCard, PhysicianCard, InnovationRow, SectionLabel, DisclaimerBlock, ConsentCheckbox, EmptyState, LoadingSkeleton)
    booking/ (wizard steps)
    portal/ (dashboard widgets)
    admin/ (sidebar, tables)
  data/ (mock content)
  i18n/ (config + locales)
  assets/ (generated images)
  styles.css (tokens + @theme)
```

## Fora do escopo desta fase

- Páginas individuais para cada um dos 18 serviços e cada uma das 15 condições — apenas o template funcional + 2-3 exemplos completos; os demais slugs renderizam a partir de mock e podem ser expandidos depois.
- Legal individual detalhado por página — placeholders visuais.
- Tradução completa de todas as strings em ES/PT/ZH — apenas Home/Header/Footer demonstram troca real.
- Qualquer integração real (backend, DB, auth, pagamento, APIs médicas).
