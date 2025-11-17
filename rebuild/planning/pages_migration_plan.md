# 📄 Pages Migration Plan - HTML to React

## 🎯 الأولويات

### P0 - صفحات حرجة (Critical)
يجب إنجازها أولاً - تؤثر مباشرة على التحويل والتنقل:

| الصفحة | HTML الأصلية | React Component | الحالة | Notes |
|--------|--------------|-----------------|--------|-------|
| **Home** | `index.html` | `(marketing)/page.tsx` | ⏳ TODO | الصفحة الرئيسية - أعلى أولوية |
| **Pricing** | `pricing.html` | `(marketing)/pricing/page.tsx` | ⏳ TODO | صفحة التسعير - conversion funnel |
| **About** | `about.html` | `(marketing)/[slug]/page.tsx` (slug=about) | ⏳ TODO | من نحن |
| **Customers** | `customers.html` | `(marketing)/customers/[slug]/page.tsx` | ⏳ TODO | قصص العملاء |
| **Gallery** | `gallery.html` | `(marketing)/gallery/page.tsx` | ⏳ TODO | معرض المشاريع |
| **Help** | `help.html` | `(marketing)/help/page.tsx` | ⏳ TODO | صفحة المساعدة |

### P1 - صفحات ثانوية (Secondary)
مهمة لكن أقل أولوية:

| الصفحة | HTML الأصلية | React Component | الحالة | Notes |
|--------|--------------|-----------------|--------|-------|
| **Brand Kit** | `brandkit.html` | `(marketing)/brandkit/page.tsx` | ⏳ TODO | Brand assets, logos, guidelines |
| **Careers** | `careers.html` | `[slug]/page.tsx` (slug=careers) | ⏳ TODO | Job listings, company culture |
| **Enterprise** | `enterprise.html` | `[slug]/page.tsx` | ⏳ TODO | Enterprise features, contact |
| **Templates** | - | `(marketing)/templates/page.tsx` | ⏳ TODO | Template library, categories |
| **Mobile** | `mobile.html` | `(marketing)/mobile/page.tsx` | ⏳ TODO | Mobile app features |
| **News** | `news/` folder | `(marketing)/news/[slug]/page.tsx` | ⏳ TODO | Blog posts, announcements |

**Shared characteristics:**
- Simpler structure than P0
- Can reuse components from P0
- Lower traffic priority
- Can delegate to subagent once P0 complete

**P1 - Detailed Parity Tables:**

#### Brand Kit (brandkit.html)
| Section | Content Parity | Components | Assets | Status |
|---------|---------------|------------|---------|--------|
| Hero | Brand guidelines intro | `BrandHero` | Logo variations ✅ | ⏳ |
| Logo Downloads | Download different formats | `DownloadSection` | SVG/PNG logos ✅ | ⏳ |
| Color Palette | Brand colors + hex codes | `ColorPalette` | N/A | ⏳ |
| Typography | Font guidelines | `TypographyGuide` | Font files ✅ | ⏳ |
| Assets Grid | Downloadable assets | `BrandAssetGrid` | Icons ✅ | ⏳ |

#### Careers (careers.html)
| Section | Content Parity | Components | Assets | Status |
|---------|---------------|------------|--------|--------|
| Hero | Join us CTA | reuse `AboutHero` | Team photo ⚠️ fallback | ⏳ |
| Culture | Company values | `CultureSection` | Office photos ✅ | ⏳ |
| Open Positions | Job listings | `JobList` | N/A | ⏳ |
| Testimonials | Employee stories | reuse `TestimonialCard` | Employee photos ⚠️ fallback | ⏳ |
| Apply CTA | Application form link | reuse `CTASection` | N/A | ⏳ |

#### Enterprise (enterprise.html)
| Section | Content Parity | Components | Assets | Status |
|---------|---------------|------------|--------|--------|
| Hero | Enterprise pitch | reuse `Hero` | Enterprise graphic ✅ | ⏳ |
| Features | Enterprise-specific features | `EnterpriseFeatures` | Feature icons ✅ | ⏳ |
| Pricing | Enterprise pricing info | `PricingComparison` | N/A | ⏳ |
| Security | Security certifications | `SecuritySection` | Badge icons ✅ | ⏳ |
| Contact | Sales contact form | `ContactForm` | N/A | ⏳ |

#### Templates (templates page)
| Section | Content Parity | Components | Assets | Status |
|---------|---------------|------------|--------|--------|
| Hero | Template library intro | reuse `Hero` | N/A | ⏳ |
| Categories | Template categories | reuse `CategoryFilter` | Category icons ✅ | ⏳ |
| Template Grid | Template cards | `TemplateGrid` | Template thumbnails ✅ | ⏳ |
| Load More | Pagination | reuse `LoadMoreButton` | N/A | ⏳ |

#### Mobile (mobile.html)
| Section | Content Parity | Components | Assets | Status |
|---------|---------------|------------|--------|--------|
| Hero | Mobile app features | reuse `Hero` | App mockup ✅ | ⏳ |
| Features | App capabilities | `AppFeatures` | Feature screenshots ✅ | ⏳ |
| Download | App store links | `DownloadButtons` | Store badges ✅ | ⏳ |
| Screenshots | App gallery | `ScreenshotCarousel` | Screenshots ✅ | ⏳ |

#### News (news pages)
| Section | Content Parity | Components | Assets | Status |
|---------|---------------|------------|--------|--------|
| Hero | News/blog header | reuse `Hero` | N/A | ⏳ |
| Article Grid | Blog posts | `BlogGrid` | Thumbnails ✅ | ⏳ |
| Filters | Category/tag filters | `TagFilter` | N/A | ⏳ |
| Pagination | Load more articles | reuse `LoadMoreButton` | N/A | ⏳ |

### P2 - صفحات طويلة الأمد (Long-tail)
يمكن تأجيلها أو أتمتتها لاحقاً:

| النوع | المسار | الحالة | استراتيجية |
|------|--------|--------|-----------|
| **Gallery Details** | `gallery/[usecase]/[category]/[detail]` | ⏳ TODO | Template-based, data from API |
| **Customer Details** | `customers/[slug]` (14 files) | ⏳ TODO | Template-based, markdown/CMS |
| **News Details** | `news/[slug]` | ⏳ TODO | Blog template, CMS integration |
| **Legal Pages** | `dpa.html`, `commercial-agreement.html`, etc. | ⏳ TODO | Simple text pages, low priority |
| **User Profiles** | `@username` pages | ⏳ TODO | Dynamic, needs auth |

**P2 - Template-Based Parity:**

#### Gallery Detail Pages (Template A)
| Route Example | Sections | Shared Components | Assets | Fallbacks |
|--------------|----------|------------------|---------|-----------|
| gallery/life/education/mathgauss | Hero, Description, Demo, Code, Comments | `DetailLayout`, `CodeViewer`, `CommentSection` | Project images ✅ | N/A |
| gallery/[usecase]/[category]/[detail] | Same structure | Same | Same | Same |

**Parity:** All gallery detail pages follow identical structure - create one template, populate from API/CMS

#### Customer Detail Pages (Template B)
| Route Example | Sections | Shared Components | Assets | Fallbacks |
|--------------|----------|------------------|---------|-----------|
| customers/allfly | Hero, Story, Metrics, Quote | `CustomerDetailLayout`, `MetricsCard`, `QuoteBlock` | Customer logo ✅ | Logos from asset_audit |
| customers/[slug] (14 files) | Same | Same | Logos ✅ | Same |

**Parity:** Standard customer story template - metrics + testimonial + logo

#### Legal Pages (Template C)
| Route Example | Sections | Shared Components | Assets | Fallbacks |
|--------------|----------|------------------|---------|-----------|
| dpa.html | Title, TOC, Content | `LegalTemplate`, `TOCNav` | N/A | N/A |
| commercial-agreement.html | Same | Same | N/A | N/A |

**Parity:** Simple text pages - low priority, template-based

#### User Profile Pages (Dynamic)
| Route Pattern | Sections | Components | Assets | Data Source |
|--------------|----------|-----------|---------|-------------|
| @username | Header, Projects, Activity | `ProfileHeader`, `ProjectGrid`, `ActivityFeed` | User avatars ⚠️ | Firebase + API |

**Parity:** Dynamic content from user database

---

**P2 Implementation Strategy:**
1. Create 3 templates (Gallery, Customer, Legal)
2. Map data sources (CMS/API/Markdown)
3. Implement once, populate many
4. Low priority - defer until P0/P1 complete

---

## 🧩 Component Inventory - P0 Pages

### Shared Components (يجب إنشاؤها أولاً)

#### 1. Layout Components
- [ ] `Header.tsx` - Navigation bar
- [ ] `Footer.tsx` - Site footer
- [ ] `MarketingLayout.tsx` - Wrapper layout

#### 2. Common Components
- [ ] `Hero.tsx` - Hero sections
- [ ] `FeatureCard.tsx` - Feature cards
- [ ] `CTAButton.tsx` - Call-to-action buttons
- [ ] `TestimonialCard.tsx` - Testimonials
- [ ] `PricingCard.tsx` - Pricing tiers

#### 3. Utilities
- [ ] `metadata.ts` - SEO metadata helper
- [ ] `typography.ts` - Typography tokens
- [ ] `animations.ts` - GSAP/scroll animations

---

## 📊 Page-by-Page Analysis

### 1. Home (index.html) - P0

**Sections identified:**
1. Hero section with CTA
2. Feature showcase
3. Customer testimonials
4. Product highlights
5. Final CTA section

**Components needed:**
- `HeroSection.tsx`
- `FeatureGrid.tsx`
- `TestimonialCarousel.tsx`
- `ProductShowcase.tsx`
- `CTASection.tsx`

**Assets:**
- Images: Check `/public/images/`
- Scripts: GTM, Datadog (already integrated)
- Styles: Extract to Tailwind classes

**Acceptance Criteria:**
- [ ] Structure matches original HTML
- [ ] All images load via Next Image
- [ ] CTAs link correctly
- [ ] Responsive breakpoints match
- [ ] Lighthouse score >= 90

---

### 2. Pricing (pricing.html) - P0

**Sections identified:**
1. Pricing header
2. Pricing tiers (Free, Pro, Teams)
3. Feature comparison table
4. FAQ section
5. CTA footer

**Components needed:**
- `PricingHeader.tsx`
- `PricingTiers.tsx`
- `FeatureComparison.tsx`
- `FAQAccordion.tsx`

**Assets:**
- Icons for features
- Pricing tier images

**Acceptance Criteria:**
- [ ] All pricing tiers display correctly
- [ ] Comparison table is responsive
- [ ] FAQ accordion works
- [ ] Stripe integration ready

---

### 3. About (about.html) - P0

**Sections identified:**
1. About hero
2. Mission statement
3. Team section
4. Values/culture
5. Join us CTA

**Components needed:**
- `AboutHero.tsx`
- `MissionSection.tsx`
- `TeamGrid.tsx`
- `ValuesSection.tsx`

**Assets:**
- Team photos
- Company photos/illustrations

**Acceptance Criteria:**
- [ ] Content matches original
- [ ] Team photos display correctly
- [ ] Links to careers page

---

### 4. Customers (customers.html) - P0

**Sections identified:**
1. Customer stories hero
2. Featured customers grid
3. Testimonials
4. Case studies

**Components needed:**
- `CustomerHero.tsx`
- `CustomerGrid.tsx`
- `CaseStudyCard.tsx`

**Assets:**
- Customer logos
- Case study images

**Acceptance Criteria:**
- [ ] Customer logos load
- [ ] Links to individual case studies work
- [ ] Testimonials display correctly

---

### 5. Gallery (gallery.html) - P0

**Sections identified:**
1. Gallery hero
2. Category filters
3. Project cards grid
4. Load more functionality

**Components needed:**
- `GalleryHero.tsx`
- `CategoryFilter.tsx`
- `ProjectCard.tsx`
- `LoadMoreButton.tsx`

**Assets:**
- Project thumbnails
- Category icons

**Acceptance Criteria:**
- [ ] Category filters work
- [ ] Project cards load correctly
- [ ] Links to detail pages work
- [ ] Infinite scroll/load more works

---

### 6. Help (help.html) - P0

**Sections identified:**
1. Help center hero
2. Search bar
3. Category cards
4. Popular articles

**Components needed:**
- `HelpHero.tsx`
- `SearchBar.tsx`
- `HelpCategoryCard.tsx`
- `ArticleList.tsx`

**Assets:**
- Category icons
- Help article thumbnails

**Acceptance Criteria:**
- [ ] Search functionality works
- [ ] Categories display correctly
- [ ] Links to articles work

---

## 🚀 Implementation Strategy

### Stage 0: Documentation (1 day) ✅ COMPLETED
- [x] Create this workbook
- [x] Audit assets in `/public/` (see `asset_audit.md`)
- [x] Document missing assets
- [x] Extend analysis to P1 pages

### Stage 1: Shared Foundation (3-4 days)
- [ ] Build Header/Footer components
- [ ] Set up typography system
- [ ] Create metadata helper
- [ ] Test shared layout

### Stage 2: P0 Migration (5-6 days)
Execute in order:
1. [ ] Home page (index.html) - 1 day
2. [ ] Pricing page - 1 day
3. [ ] About page - 0.5 day
4. [ ] Customers page - 1 day
5. [ ] Gallery page - 1.5 days
6. [ ] Help page - 0.5 day

### Stage 3: P1 Delegation (2-3 days)
- [ ] Delegate to subagent with checklist
- [ ] QA review each page

---

## ✅ Quality Checklist (per page)

- [ ] **Structure**: HTML structure replicated in React
- [ ] **Content**: All text content present
- [ ] **Images**: All images load via Next Image
- [ ] **Links**: All CTAs and links work
- [ ] **Responsive**: Breakpoints match original
- [ ] **Accessibility**: ARIA labels, semantic HTML
- [ ] **Performance**: Lighthouse score >= 90
- [ ] **SEO**: Metadata correct
- [ ] **Side-by-side test**: Compare with original

---

## 📝 Notes

- Use `convert_static_to_dynamic.py` for initial scaffolding
- Defer complex animations until core structure is stable
- Focus on content parity first, polish later
- Document any missing assets in separate file

---

**Created**: November 17, 2025  
**Last Updated**: November 17, 2025  
**Status**: ✅ Stage 0 COMPLETED - Ready for Stage 1 (Shared Foundation)
