# MediFlow+ Design System (DESIGN.md)

> Source of truth: Stitch Project **"MediFlow+ Rural Health App"** (ID: `16341560252394000441`) and [MEDIFLOW_SPEC.md](file:///f:/mediflow%20project/Mediflow%20Production%20level%20app/docs/MEDIFLOW_SPEC.md).

---

## 1. Brand & Aesthetic Principles

This design system is specifically engineered for frontline healthcare staff, Accredited Social Health Activists (ASHAs), Primary Health Centre (PHC) medical officers, and rural villagers. The environment is defined by low-tier Android mobile hardware (390px base width), intense outdoor direct sunlight, erratic cellular connectivity, and acute cognitive load.

### Core Tenets
1. **Rural-First & Sunlight-Proof**: Extreme color contrast (passing WCAG AAA where possible), crisp architectural boundaries, and strictly zero low-contrast decorative subtleties.
2. **Non-Ornamental & Direct**: No glassmorphism, zero gradient fills, and no ambient decorative blurs. Depth is rendered purely through distinct surface contrast and structured boundary lines.
3. **Cognitive Protection & Card Guardrails**:
   - **Summary Card Limit**: A strict maximum of **5 summary cards** per dashboard/home screen to eliminate clutter.
   - **Unrestricted Data Lists**: Clinical and operational rosters (medicines, patients, requests, orders, audit/activity logs) can be of any length, paginated or scrolling, with pinned primary CTAs.
4. **Bilingual Trust Architecture (Dual-Script Parity)**:
   - Always dual-script English and Marathi.
   - **Language Toggle**: Always reads `"English | मराठी"`, never `"EN | MR"`.
   - **Dynamic Stacking Order**:
     - When **English** is active: English is the primary line (16px SemiBold, `#0F172A`), Marathi is the secondary line (14px Regular, solid `#1E293B`).
     - When **Marathi** is active: Marathi is the primary line (16px SemiBold, `#0F172A`), English is the secondary line (14px Regular, solid `#1E293B`).
     - The secondary line uses solid `text-secondary` (`#1E293B`) color with **no opacity**.
     - **Font Size Floor**: Standard operational and body copy **never falls below 14px**.
5. **Animation Policy**:
   - **Strictly minimal**: No decorative transitions, sliding animations, or card hover lift effects.
   - **Allowed micro-animations only**:
     1. Small **Live-dot pulse** (`#16A34A`) indicating active realtime connection.
     2. Short **fade highlight** (amber or teal tint fading to normal in ~600ms) when a data cell or inventory value updates in realtime.
6. **Plain Language & Terminology**:
   - Use plain, non-bureaucratic wording everywhere: **"District Health Office"** (never "DHO") and **"requests"** (never "indents").
7. **Emergency & Contact Rules**:
   - **Ambulance 108**: Always displayed as plain informational text (e.g., `Emergency: Ambulance 108 (Info only) / आणीबाणी: रुग्णवाहिका १०८ (केवळ माहितीसाठी)`). **NEVER** render as a Call button or `tel:` link.
   - **PHC Calling**: Dedicated "Call PHC" buttons may exist because PHC numbers are strictly fictional (`0000 000000`).
8. **Specification Precedence**: As per [MEDIFLOW_SPEC.md](file:///f:/mediflow%20project/Mediflow%20Production%20level%20app/docs/MEDIFLOW_SPEC.md), all content represents the fictional "Demo District, Rampur Taluka" and "Rural Health Demo Network". No OTP, no SMS toggles, no Pune references, no ABHA, and no government claims.

---

## 2. Color Palette & Roles

Translucent tints and pastel washes are strictly prohibited for actionable elements. High-contrast solid fills and clear structural lines guarantee sunlight readability.

### Core Palette
| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `primary-brand` | `#0C4A60` | Deep Teal. Primary operational anchor: headers, app bars, primary action CTAs, active states (>9:1 contrast ratio). |
| `primary-dark` | `#003244` | Dark Teal. High-emphasis contrast surfaces and active headers. |
| `primary-container`| `#0C4A60` | Structural brand containers and emphasized interactive cards. |
| `primary-fixed` | `#BFE9FF` | Soft accent brand container fill. |
| `on-primary` | `#FFFFFF` | Text and icons on primary brand surfaces. |
| `app-background` | `#F8FAFC` / `#FAF8FF` | Level 0 application background ground. |
| `surface-white` | `#FFFFFF` | Level 1 cards, elevated sheets, input field interiors. |
| `surface-well` | `#F1F5F9` | Sub-header sync ribbons, structural container wells, inactive pill fills. |
| `surface-border` | `#CBD5E1` | Slate 300. High-contrast 1.5px/2px borders for card and input separation. |
| `text-primary` | `#0F172A` | Charcoal 900. High-contrast primary copy and headings. |
| `text-secondary` | `#1E293B` | Slate 800. Auxiliary subtext, secondary language line, metadata labels, timestamps. |
| `text-muted` | `#64748B` | Slate 500. Tertiary indicators and disabled text. |

### Status Semantic System
Status must **never** rely on color alone; every state is paired with a dedicated SVG glyph and a bilingual text label.

| Status State | Color Hex | Background (10% Tint) | Border Hex | SVG Icon Glyph | Bilingual Label Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Available / Approved** | `#16A34A` | `#F0FDF4` | `#16A34A` | Checkmark Circle (`check-circle`) | Available / उपलब्ध |
| **Low Stock / Pending** | `#D97706` | `#FFFBEB` | `#D97706` | Alert Triangle (`alert-triangle`) | Low Stock / कमी साठा |
| **Out of Stock / Critical**| `#DC2626` | `#FEF2F2` | `#DC2626` | Alert Octagon (`alert-octagon`) | Out of Stock / साठा संपला |
| **Restocking / In Transit**| `#2563EB` | `#EFF6FF` | `#2563EB` | Refresh / Truck (`truck` / `sync`) | Restocking / पुनर्भरती सुरू |
| **Inactive / Disabled** | `#64748B` | `#F8FAFC` | `#CBD5E1` | Minus Circle (`minus-circle`) | Paused / तात्पुरते बंद |

---

## 3. Typography System

The typography engine pairs **Plus Jakarta Sans** (Latin/English) with **Noto Sans Devanagari** (Marathi), balancing optical heights and baseline alignment.

```css
font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif;
```

### Type Scale & Tokens
| Token | Font Size | Line Height | Weight | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headline-lg` | `26px` (1.625rem) | `34px` | Bold (700) | `-0.02em` | Primary screen titles, splash banners |
| `headline-md` | `22px` (1.375rem) | `28px` | Bold (700) | `-0.01em` | Section headings, modal header |
| `headline-sm` | `18px` (1.125rem) | `24px` | SemiBold (600) | Normal | Card titles, patient/medicine identifiers |
| `body-lg` | `18px` (1.125rem) | `26px` | Regular (400) | Normal | Hero descriptions, key instructions |
| `body-md-bold`| `16px` (1.0rem) | `24px` | SemiBold (600) | Normal | Primary interactive button text, card summary |
| `body-md` | `16px` (1.0rem) | `24px` | Regular (400) | Normal | Standard operational body copy |
| `label-lg` | `16px` (1.0rem) | `20px` | SemiBold (600) | Normal | Field labels, navigation tab titles |
| `label-md` | `14px` (0.875rem) | `18px` | SemiBold (600) | `+0.01em` | Table headers, secondary language line, status tags |
| `label-sm` | `14px` (0.875rem) | `18px` | SemiBold (600) | `+0.02em` | Timestamps, status chips, disclaimers (Floor: 14px) |

---

## 4. Spacing, Layout & Touch Ergonomics

- **Grid Architecture**: Single-column fluid layout with a rigid `16px` (`1rem`) lateral screen margin. Internal card padding is locked to `16px` (`1rem`).
- **Touch Target Floor**: Every interactive target—buttons, list chevrons, language toggles, radio buttons, and inputs—has an absolute minimum bounding box of **48px x 48px**.
- **Density Guardrail**: A strict maximum of 5 cards per summary view. Full lists allow smooth vertical scrolling with pinned action bars.

---

## 5. Specialized Component Specifications

### 5.1 System Shell, Live Badge & Status Banners (from `Live Activity`, `State: Offline`, `State: Back Online`)
- **Primary Header**: Fixed 64px height. Deep teal `#0C4A60` background.
  - Left: Logo icon + "MediFlow+" (English/Marathi toggleable).
  - Right:
    - **Language Toggle**: Pinned interactive pill `#083344` container with white text: `"English | मराठी"`.
    - **Live Badge**: Pill container (`#083344`) with an active green dot (`#16A34A`) featuring a subtle CSS pulse/ping micro-animation + text `"Live / थेट"`.
- **Sub-Header Sync Ribbon**: Height 36px. Direct slate background (`#F1F5F9`) with `#1E293B` text and 16px refresh SVG glyph:
  - *Normal/Synced*: `Last synced: 2 min ago / शेवटचे समक्रमित: २ मिनिटांपूर्वी`
  - *Syncing*: `Syncing updates... / समक्रमित होत आहे...` (blue `#2563EB`)
  - *Outdated warning* (if > 30 mins): Amber `#D97706` container with `Data may be outdated / डेटा कालबाह्य असू शकतो`.
- **Offline / Connectivity State Banners**:
  - *Offline Banner* (`State: Offline`): Fixed ribbon `#FEF2F2` (1.5px border `#DC2626`). Red icon + text: `You are offline. Showing saved data. Some information may be outdated. / तुम्ही ऑफलाइन आहात. सेव्ह केलेला डेटा दाखवत आहे.`
  - *Reconnected Banner* (`State: Back Online`): Fixed ribbon `#F0FDF4` (1.5px border `#16A34A`). Green checkmark + text: `Back online. Syncing changes... / पुन्हा ऑनलाइन आले. समक्रमित होत आहे...` transitioning to `Synced / समक्रमित`.
- **Terminal Footer Disclaimer**: Pinned or trailing banner across all data screens:
  - `Demo environment. All data is fictional. / डेमो वातावरण. सर्व माहिती काल्पनिक आहे.` (14px SemiBold `#64748B`).

### 5.2 Timeline & Progress Tracker (from `Shipment Tracker`, `Root Cause`, `Audit Trail`)
Used for step flows, reorder approval stages, order tracking, and root-cause audit paths.
- **Connecting Line**: Vertical 2.5px solid line:
  - Completed paths: `#16A34A` (Medical Green) or `#0C4A60` (Primary Teal).
  - Pending/Future paths: `#CBD5E1` (Slate 300).
- **Node Indicators (28px x 28px)**:
  - **Done / Completed**: Solid circle `#16A34A` with crisp white 16px checkmark SVG.
  - **Current / In-Progress**: Solid circle `#0C4A60` with active white pulsing center dot or 2px teal halo.
  - **Pending / Upcoming**: Slate circle `#F1F5F9` with 1.5px `#CBD5E1` border and neutral slate dot.
  - **Rejected / Alert**: Solid red `#DC2626` circle with white exclamation / cross icon.
- **Node Content Structure**:
  - **Step Title**: 16px SemiBold (`#0F172A`), dual-script (e.g., `Dispatched from Warehouse / गोदामातून पाठवले`).
  - **Actor & Role**: 14px Regular (`#1E293B`) (e.g., `Rajesh Pawar · Supply Depot`).
  - **Timestamp**: 14px Regular (`#1E293B`) (e.g., `20 Sep, 10:45 AM`).
  - **State Note / Reason**: Optional 14px block in `#F8FAFC` container with 1.5px `#CBD5E1` border (e.g., Rejection reason or dispatch vehicle number).

### 5.3 Chart Styling (from `My Health`, `Pharmacist Demand`, `District Demand`)
All charts (Recharts) follow a strict high-contrast, sunlight-proof color and annotation model:
- **Palette**:
  - Primary metric / Moving average: Solid `#0C4A60` (stroke width: 2.5px, dot: 4px).
  - Reference / Threshold / Safety stock: High-contrast dashed line `#D97706` (stroke width: 1.5px, strokeDasharray: "4 4").
  - Critical / Urgent boundary: Dashed line `#DC2626`.
  - Secondary comparison / Dispensed bars: Solid `#16A34A` (radius: 4px).
  - Background grid lines: Clean horizontal `#E2E8F0` (stroke width: 1px, no vertical grid lines).
- **Chart Layout & Headers**:
  - Title & Date Range: 16px SemiBold + date range pill (e.g., `14-Day Usage Trend · 06 Sep - 20 Sep / १४-दिवसीय वापर कल`).
  - Axis Labels: 12px-14px Slate 800 (`#1E293B`), never muted below contrast. Always include bilingual unit (e.g., `Units / युनिट्स`, `mmHg`, `mg/dL`).
  - Last Updated Line: `Last updated: Today, 08:00 AM · Statistical estimation, not AI / शेवटचे अपडेट: आज, स. ०८:०० · सांख्यिकीय अंदाज, AI नाही` (14px `#1E293B`).
  - Tooltips: Pure white `#FFFFFF` card, 1.5px solid border `#CBD5E1`, 4px radius, no drop shadows.

### 5.4 Taluka Map Markers (from `Taluka Map`)
Map views render the 6 PHCs in Rampur Taluka using clear geographical cluster cards and interactive marker pins.
- **Marker Pin System**:
  - **Green Marker (Normal / Sufficient Stock)**:
    - Background: `#16A34A`, White border: 2px, Size: 36px x 36px.
    - SVG Glyph: Checkmark (`check`).
    - Status Chip: `Normal Stock / पुरेसा साठा` (`#F0FDF4` bg, `#16A34A` text).
  - **Amber Marker (Low Stock / Attention Required)**:
    - Background: `#D97706`, White border: 2px, Size: 36px x 36px.
    - SVG Glyph: Alert Triangle (`alert-triangle`).
    - Status Chip: `Low Stock / कमी साठा` (`#FFFBEB` bg, `#D97706` text).
  - **Red Marker (Critical / Out of Stock / Paused)**:
    - Background: `#DC2626`, White border: 2px, Size: 36px x 36px.
    - SVG Glyph: Alert Octagon (`alert-octagon`).
    - Status Chip: `Critical Stock / गंभीर तुटवडा` (`#FEF2F2` bg, `#DC2626` text).
  - Each marker pin expands or opens a bottom drawer card showing PHC Name, Doctor/ANM on duty, current operating status (Consulting / Paused), and top medicine alerts.

---

## 6. Standard Component Specifications

### Buttons
- **Primary Button**: Strictly one per view. Height: 52px (min 48px target). Background: `#0C4A60`, text: `#FFFFFF`, 6px corner radius. Dual-script layout.
- **Secondary Button**: Outlined 2px solid `#0C4A60`, background: `#FFFFFF`, text: `#0C4A60`. Height: 52px.
- **Destructive / Emergency Action**: Background: `#DC2626`, text: `#FFFFFF`. Height: 52px.

### Cards & Wells
- Solid white container (`#FFFFFF`) with 1.5px solid border (`#CBD5E1`) and 6px radius. Padding: 16px.
- Max 5 cards for summary screens; unlimited cards for lists.

### Input Fields
- Height: 52px. Bounded by 2px border in `#CBD5E1` (shifts to `#0C4A60` on active focus).
- Background: `#FFFFFF`.
- Label placed permanently above the field in 16px bold (`#0F172A`), never floating. Error message in `#DC2626` paired with an alert icon below.

### Checkboxes & Radio Elements
- Bounding touch target: 48px x 48px minimum.
- Visual box size: 24px x 24px with high-contrast 2px border. Selected state uses solid `#0C4A60` fill with a high-contrast white checkmark.
