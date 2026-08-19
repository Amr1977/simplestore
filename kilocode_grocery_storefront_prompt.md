# KiloCode AI — Full Implementation Prompt
## Zero-Budget Arabic-First Grocery Storefront — Web + Android APK

You are the lead engineer responsible for implementing this project end-to-end.

Build a polished, production-quality, Arabic-first, RTL, mobile-first single-vendor grocery storefront that can be demonstrated to real grocery-store owners in Abu Qir, Alexandria, Egypt.

The product must run at **$0 budget** using only free-tier/no-cost services and open-source tooling.

The demo store is NOT placeholder data. It is a critical sales/demo environment and must look like a real commercial grocery store.

---

# 1. Product Goal

Build a reusable white-label grocery storefront platform.

V1 is **single-vendor mode**:

- one store
- one vendor/admin
- many anonymous customers
- customers browse products
- customers add products to cart
- customers submit an order
- order is generated as a professional WhatsApp message
- vendor receives the order through WhatsApp
- vendor manages products/categories/store settings through an admin dashboard

The architecture should be reusable for future multi-vendor support, but DO NOT implement multi-vendor complexity in V1.

Primary market:

- Abu Qir
- nearby Alexandria areas
- Egyptian grocery stores

Primary language:

- Arabic

Secondary language support may be architecturally possible, but Arabic/RTL is the priority.

---

# 2. Non-Negotiable Constraints

## Budget

The application must be designed to run at $0.

Do NOT introduce paid infrastructure.

Do NOT require:

- paid VPS
- paid database
- paid backend
- paid image hosting
- paid CDN
- paid authentication service
- paid API
- paid monitoring service

Use free tiers only.

## Firebase

Use Firebase for:

- Firebase Hosting
- Firestore
- Firebase Authentication

DO NOT use Firebase Cloud Storage.

DO NOT depend on Firebase Cloud Functions for V1 because the zero-budget architecture must remain compatible with Firebase's no-cost tier.

If a feature appears to require Cloud Functions, redesign it to work client-side or using another zero-cost mechanism.

## Media

Use **Cloudinary** for:

- product images
- product videos
- store logo
- store banner
- other store media

Do NOT store binary media in Firestore.

Firestore stores only metadata and Cloudinary URLs/public IDs.

## Database

Use **Firestore**.

DO NOT use Neon/PostgreSQL in V1.

Do not add Neon merely because it is available on a free tier.

The application does not need relational SQL complexity.

## Android

Use:

- Capacitor
- Android
- GitHub Actions

The Android application must be generated from the same React application.

Do not create a separate native Android application.

---

# 3. Recommended Technology Stack

Use:

- React
- Vite
- TypeScript
- React Router
- Firebase Web SDK
- Firestore
- Firebase Authentication
- Cloudinary
- Capacitor
- CSS architecture of your choice, preferably Tailwind CSS if it can be configured cleanly
- GitHub Actions

Use modern stable versions compatible with the project.

Avoid unnecessary dependencies.

Prefer small, well-maintained packages.

---

# 4. Application Architecture

Target architecture:

```text
                         React + Vite
                              |
              +---------------+----------------+
              |               |                |
              v               v                v
        Firebase Auth     Firestore        Cloudinary
              |               |                |
           Vendor          Store data       Images
           login           Products         Videos
                           Categories        Logo
                           Orders            Banner
                           Settings
                              |
                              v
                         WhatsApp
                              |
                              v
                           Vendor
```

Android:

```text
React/Vite
    |
    +---- Web / PWA
    |
    +---- Capacitor
              |
              +---- Android APK
```

Deployment:

```text
GitHub
   |
   +---- GitHub Actions
             |
             +---- Firebase Hosting deployment
             |
             +---- Android build
                       |
                       +---- APK artifact
```

---

# 5. Core Product Principles

The UI must feel:

- professional
- modern
- simple
- fast
- trustworthy
- familiar to Egyptian users
- optimized for phones
- visually polished
- commercial rather than "developer prototype"

Avoid:

- excessive animations
- excessive gradients
- giant hero sections
- complicated navigation
- unnecessary login
- unnecessary popups
- excessive text
- generic Bootstrap-looking UI
- placeholder-looking product cards
- fake analytics dashboards with meaningless numbers

The customer should understand the store immediately.

Primary customer flow:

```text
Open
  ↓
Browse/Search
  ↓
Choose product
  ↓
Add to cart
  ↓
Review cart
  ↓
Enter delivery details
  ↓
Send order through WhatsApp
```

---

# 6. Arabic / RTL Requirements

Arabic is the primary language.

The application must be RTL by default.

Use:

```html
<html lang="ar" dir="rtl">
```

or equivalent runtime handling.

Use a high-quality Arabic font such as:

- Cairo
- Tajawal

Prefer a locally bundled/web-optimized font strategy that does not unnecessarily slow the application.

All UI labels must be Arabic.

Examples:

- الرئيسية
- الأقسام
- المنتجات
- السلة
- إتمام الطلب
- إرسال الطلب عبر واتساب
- لوحة التحكم
- المنتجات
- إضافة منتج
- تعديل المنتج
- الإعدادات
- متاح
- غير متاح
- السعر
- الكمية
- الإجمالي

Do not translate technical terminology into awkward Arabic.

Use natural Egyptian/e-commerce Arabic.

Currency:

```text
جنيه
```

or:

```text
ج.م
```

Use one consistent display style.

---

# 7. Responsive Design

Mobile-first.

Primary target:

- 360x800
- 390x844
- common Android phones

Also support:

- tablets
- desktop

Mobile UI must not simply be a shrunken desktop layout.

Desktop can use:

- wider product grids
- sidebar/navigation
- larger content containers

Mobile should use:

- compact header
- bottom/cart affordance where useful
- large touch targets
- 2-column product grid where appropriate
- sticky actions when useful

Touch targets should generally be at least approximately 44px.

---

# 8. Store Model

Design Firestore around a store entity even though V1 supports only one store.

Recommended:

```text
stores/{storeId}
```

Store document:

```text
{
  name,
  slug,
  description,
  logo,
  banner,
  whatsappNumber,
  phone,
  address,
  theme,
  delivery,
  openingHours,
  active,
  createdAt,
  updatedAt
}
```

Theme:

```text
{
  preset,
  primary,
  secondary,
  accent
}
```

Delivery:

```text
{
  enabled,
  fee,
  minimumOrder,
  freeDeliveryThreshold
}
```

Do not overcomplicate this.

---

# 9. Store Branding

The store must support:

- logo
- banner image
- theme color
- store name
- tagline/description
- phone
- WhatsApp number
- address
- opening hours
- delivery configuration

The vendor must be able to edit these from the admin panel.

The storefront should automatically apply the selected theme.

Prevent unreadable color combinations.

Use CSS variables/design tokens.

Example conceptual tokens:

```text
--color-primary
--color-secondary
--color-accent
--color-background
--color-surface
--color-text
--color-muted
--color-border
```

---

# 10. Store Banner

Support a Cloudinary banner image.

Recommended mobile-friendly ratio:

approximately 2.5:1 to 3:1.

Do not make the banner consume most of the first screen.

The customer should reach categories/products quickly.

The banner may contain:

- store branding
- short tagline
- promotional message

But avoid putting important text only inside the image.

---

# 11. Categories

Create a categories collection:

```text
stores/{storeId}/categories/{categoryId}
```

Fields:

```text
{
  name,
  description,
  imageUrl,
  sortOrder,
  active,
  createdAt,
  updatedAt
}
```

Initial demo categories:

1. ألبان ومنتجات الألبان
2. بقالة
3. زيوت وسمن
4. مشروبات
5. حلويات وسناكس
6. منظفات
7. خضروات
8. عناية شخصية
9. مياه ومشروبات
10. مجمدات

The exact final categorization can be optimized for the demo catalog.

---

# 12. Product Model

Use:

```text
stores/{storeId}/products/{productId}
```

Product:

```text
{
  name,
  description,
  categoryId,
  price,
  oldPrice,
  unit,
  available,
  featured,
  popular,
  sortOrder,
  media,
  createdAt,
  updatedAt
}
```

Use numeric values for prices.

Example:

```text
price: 42
```

not:

```text
price: "42 جنيه"
```

---

# 13. Product Media

A product may have:

- one image
- multiple images
- one video
- multiple videos
- a mixture of images and videos

Media should be stored as metadata:

```text
media: [
  {
    id,
    type: "image",
    publicId,
    secureUrl,
    thumbnailUrl,
    width,
    height,
    duration,
    sortOrder
  }
]
```

For video:

```text
{
  id,
  type: "video",
  publicId,
  secureUrl,
  thumbnailUrl,
  width,
  height,
  duration,
  sortOrder
}
```

Do not store media binaries in Firestore.

Do not load all high-resolution media unnecessarily.

Use Cloudinary transformations for:

- thumbnails
- responsive widths
- WebP/AVIF where appropriate
- optimized video delivery

Lazy-load secondary media.

The primary product image should load quickly.

---

# 14. Cloudinary Security

Never expose:

```text
CLOUDINARY_API_SECRET
```

in the browser.

Do not put secrets in:

- React source
- Vite environment variables that are shipped to the client
- GitHub repository
- Firestore documents

For the zero-budget V1, use a carefully restricted Cloudinary unsigned upload preset if appropriate.

Restrict uploads by:

- allowed resource types
- folder
- file size
- transformations where possible
- allowed formats

Use a clear folder structure such as:

```text
grocery-demo/stores/{storeId}/
grocery-demo/stores/{storeId}/products/{productId}/
```

If unsigned upload limitations prevent a secure implementation for a particular feature, document the limitation and design the safest no-cost alternative rather than exposing a secret.

---

# 15. Demo Store — CRITICAL

The demo store is a core deliverable.

Do not treat it as seed/test data.

It will be shown to real grocery-store owners to sell the product.

Create a fictional but realistic Egyptian grocery store:

## Store Name

```text
بقالة أبو قير
```

## Tagline

```text
كل احتياجات البيت في مكان واحد
```

Location:

```text
أبو قير - الإسكندرية
```

Use a professional grocery visual identity.

Create:

- logo
- store banner
- coherent color theme
- product imagery
- realistic product names
- realistic descriptions
- realistic demo prices
- categories
- featured products
- popular products

Do not use:

```text
Product 1
Product 2
Test Product
Lorem ipsum
```

anywhere in the customer-facing demo.

---

# 16. Demo Catalog

Target approximately:

**100–150 products.**

Recommended distribution:

```text
ألبان ومنتجات الألبان       12–15
بقالة                       20–25
زيوت وسمن                  8–12
مشروبات                    12–15
حلويات وسناكس              12–18
منظفات                     10–15
خضروات                     10–15
عناية شخصية                8–12
مياه ومشروبات              5–10
مجمدات                      5–10
```

Use recognizable Egyptian-market product types and realistic units:

- 500 جم
- 1 كجم
- 1 لتر
- 2 لتر
- عبوة
- كرتونة where appropriate

Prices should be plausible Egyptian demo prices.

Do not falsely claim that demo prices are verified current market prices.

If researching current prices, use current Egyptian retail sources and record the research date separately from the application data.

---

# 17. Demo Product Media

This is critical.

Use professional-looking product imagery.

Avoid:

- obvious placeholders
- broken images
- inconsistent dimensions
- low-quality stock images
- bizarre AI packaging
- misspelled Arabic packaging
- watermarked images

Aim for:

- clean backgrounds
- consistent visual treatment
- recognizable product packaging
- consistent aspect ratios
- optimized images

Each important demo product should have at least one high-quality primary image.

Selected products should have:

- 2–3 images
- occasional short product video

Do not create videos for every product because of Cloudinary free-tier constraints.

The demo should visually demonstrate that the platform supports image galleries and video.

---

# 18. Customer Home Page

Build a polished home page.

Recommended structure:

```text
Header
  Store logo/name
  Cart
  Menu if needed

Search

Store Banner

Categories

Featured Products

Popular Products

Promotions / offers if useful

Footer / store information
```

Do not overload the page.

The first screen must make it obvious:

- what store this is
- what can be purchased
- how to search
- where the cart is

---

# 19. Product Cards

Product cards are one of the most important UI components.

Each card should contain:

- product image
- product name
- unit
- price
- optional old price
- availability
- add button

Example:

```text
┌──────────────────────┐
│                      │
│       IMAGE          │
│                      │
├──────────────────────┤
│ أرز الضحى            │
│ 1 كجم                │
│                      │
│ 42 جنيه              │
│                [+]   │
└──────────────────────┘
```

When quantity > 0:

```text
[-]  2  [+]
```

Do not force users through a product-detail page for simple grocery purchases.

---

# 20. Product Details

For products with multiple media:

- image carousel
- video support
- product name
- price
- unit
- description
- availability
- quantity control
- add to cart

Videos should not autoplay with sound.

Use poster/thumbnail images.

---

# 21. Search

Implement client-side search for V1 if the catalog size permits it.

Search:

- Arabic names
- product names
- category names where useful

Normalize Arabic search input enough to make common variations useful.

Consider normalizing:

- أ / إ / آ → ا
- ة / ه where appropriate only if it does not create bad matches
- ي / ى where appropriate
- remove diacritics

Do not overengineer search.

---

# 22. Cart

Cart should persist locally.

Use:

- localStorage
- or another lightweight client-side persistence mechanism

Cart should survive:

- refresh
- navigation
- closing/reopening the browser where practical

Cart data:

```text
{
  productId,
  name,
  price,
  unit,
  quantity,
  imageUrl
}
```

Do not trust client-side totals for any future payment functionality.

For WhatsApp ordering, regenerate totals from the current product catalog where practical before creating the final message.

---

# 23. Checkout

No customer account required.

Do NOT force registration.

Collect:

- customer name
- phone number
- address
- notes
- payment method

V1 payment method:

```text
الدفع عند الاستلام
```

Optionally allow:

```text
الدفع عند الاستلام
```

as the only enabled method.

Delivery:

- delivery enabled/disabled
- delivery fee
- minimum order
- free delivery threshold

Show a clear order summary.

---

# 24. WhatsApp Order

Generate a professional Arabic WhatsApp message.

Example structure:

```text
طلب جديد 🛒

متجر: بقالة أبو قير

العميل:
أحمد محمد

الهاتف:
01XXXXXXXXX

العنوان:
أبو قير - ...

الطلبات:

2 × أرز الضحى 1 كجم
84 جنيه

1 × لبن كامل الدسم
35 جنيه

3 × مياه معدنية
30 جنيه

--------------------
قيمة المنتجات: 149 جنيه
التوصيل: 10 جنيه
الإجمالي: 159 جنيه

طريقة الدفع:
الدفع عند الاستلام

ملاحظات:
...
```

Use WhatsApp deep linking.

Do not use a paid WhatsApp API.

The customer's installed WhatsApp app should handle the actual sending.

On web/desktop, fall back to WhatsApp Web behavior.

The WhatsApp number must be configurable in store settings.

---

# 25. Order Persistence

Even though WhatsApp is the communication mechanism, maintain an optional Firestore order record.

Use:

```text
stores/{storeId}/orders/{orderId}
```

Fields:

```text
{
  customerName,
  phone,
  address,
  notes,
  items,
  subtotal,
  deliveryFee,
  total,
  paymentMethod,
  status,
  createdAt
}
```

Status:

```text
new
contacted
confirmed
delivered
cancelled
```

Important:

The system should NOT pretend that a WhatsApp message was successfully delivered just because the user clicked the button.

Record:

```text
whatsappInitiatedAt
```

rather than falsely marking it as delivered.

---

# 26. Customer Authentication

Do NOT require customer authentication.

Customer:

- opens storefront
- shops anonymously
- submits order

Firebase Authentication is for the vendor/admin.

Future customer accounts can be added later.

---

# 27. Vendor Authentication

Use Firebase Authentication.

V1 should support a vendor/admin account.

Prefer email/password authentication unless a free phone OTP implementation is clearly justified.

Do not create a public registration screen for arbitrary vendors.

Vendor account creation should be an administrator/deployment setup task.

---

# 28. Firestore Security

Security is mandatory.

Customers should be able to read public catalog/store data.

Customers should NOT be able to modify:

- products
- categories
- store settings
- vendor configuration

Vendor/admin should be able to manage their store.

Do not rely only on hidden UI routes for security.

Enforce authorization in Firestore rules.

Do not use:

```text
allow read, write: if true;
```

except in a temporary local development rule that is never deployed.

Design the rules so that future multi-store support is possible.

---

# 29. Recommended Security Model

Use Firebase Auth plus a vendor identity associated with the store.

Possible model:

```text
users/{uid}
{
  role: "vendor",
  storeId: "abu-qir-demo"
}
```

Rules should verify:

```text
request.auth != null
```

and the authenticated user is authorized for the target store.

For V1, it is acceptable to have one vendor account mapped to one store.

Do not put authorization decisions solely in localStorage.

---

# 30. Vendor Dashboard

Create:

```text
/admin/login
/admin/dashboard
/admin/products
/admin/products/new
/admin/products/:id/edit
/admin/categories
/admin/settings
/admin/orders
```

Dashboard should be professional but simple.

Home dashboard:

```text
لوحة التحكم

طلبات جديدة       7
المنتجات          126
غير متوفر          8
```

Do not fabricate analytics.

Only display real values derived from Firestore.

---

# 31. Vendor Product Management

Vendor can:

- create product
- edit product
- delete product
- change price
- change category
- upload media
- reorder media
- mark available/unavailable
- mark featured
- mark popular

Product form:

```text
صورة / صور المنتج
اسم المنتج
الوصف
القسم
السعر
السعر القديم
الوحدة
متاح للبيع
منتج مميز
الأكثر طلباً
```

Make editing fast.

Provide quick availability toggles in the product list.

---

# 32. Media Manager

Vendor should be able to:

- upload multiple images
- upload video
- reorder media
- select primary image
- remove media
- preview media

Use drag-and-drop where appropriate on desktop.

On mobile admin, use touch-friendly controls.

Do not make media management unnecessarily complicated.

---

# 33. Category Management

Vendor can:

- add category
- edit category
- reorder categories
- activate/deactivate category

Do not allow deletion of a category if products depend on it without a safe migration/confirmation flow.

---

# 34. Store Settings

Vendor can edit:

- store name
- description
- logo
- banner
- theme
- WhatsApp number
- phone
- address
- delivery settings
- opening hours

Show a preview where practical.

---

# 35. Orders Dashboard

Orders list:

```text
الطلبات

#1024
أحمد محمد
159 جنيه
جديد
18:42

#1023
محمد علي
280 جنيه
تم التأكيد
17:55
```

Order detail:

- customer
- phone
- address
- items
- totals
- notes
- status
- order timestamp
- WhatsApp action if useful

Vendor can change status.

---

# 36. UI Design System

Create reusable components:

```text
Button
IconButton
Input
SearchInput
Select
Modal
Drawer
Toast
Badge
Card
ProductCard
CategoryCard
Price
QuantityControl
CartButton
ProductGallery
EmptyState
LoadingState
ErrorState
ConfirmDialog
```

Avoid duplicating UI code.

---

# 37. Design Language

Use:

- clean cards
- moderate border radius
- subtle shadows/borders
- strong typography
- generous spacing
- restrained color palette
- clear primary CTA

Do not use excessive rounded "pill" UI everywhere.

Do not use excessive animations.

Micro-interactions are encouraged:

- add-to-cart feedback
- cart count update
- subtle transitions
- loading skeletons
- success confirmation

Animations must not make the app feel slow.

---

# 38. Accessibility

Implement:

- semantic HTML
- keyboard navigation
- visible focus
- proper labels
- alt text
- sufficient contrast
- accessible buttons
- no color-only status indicators

Arabic text must remain readable.

---

# 39. Performance

Optimize for low-end Android devices and Egyptian mobile networks.

Requirements:

- lazy-load images
- responsive image sizes
- Cloudinary transformations
- avoid huge JS bundles
- code split admin routes if practical
- cache static assets
- avoid unnecessary Firestore reads
- avoid real-time listeners unless necessary
- paginate or limit admin lists if needed

The storefront should feel fast on a modest mobile connection.

---

# 40. Firestore Read Optimization

Do not continuously listen to the entire catalog.

Prefer:

- one-time reads where appropriate
- limited queries
- category filtering
- cached state
- memoized selectors

For the storefront, catalog data can be loaded efficiently and cached client-side.

Do not create a Firestore query for every product card.

---

# 41. PWA

Implement PWA support.

Requirements:

- manifest
- app icon
- theme color
- installable
- offline shell
- useful caching strategy

Do not make offline ordering appear successful if the network is unavailable.

The app may allow catalog browsing from cached data but must clearly handle unavailable network operations.

---

# 42. Android / Capacitor

Configure:

- app name
- package ID
- icon
- splash screen
- status bar
- navigation behavior

Suggested package ID:

```text
com.example.abuqirgrocery
```

Use a neutral/reusable package ID if the project is intended to become white-label.

The Android application must use the same React UI.

WhatsApp links must work from Android.

Test both:

- WhatsApp installed
- WhatsApp unavailable

Provide a graceful fallback.

---

# 43. GitHub Actions

Create workflows.

## Web deployment

On push to main:

```text
install
typecheck
lint
test
build
deploy Firebase Hosting
```

## Android

On release/tag/manual workflow:

```text
install
build web
sync Capacitor
build Android
produce APK
upload artifact
```

Do not commit signing secrets.

If a signed release build is configured, use GitHub Secrets.

For initial development, debug APK generation is acceptable.

---

# 44. Environment Variables

Separate public configuration from secrets.

Client-safe values may include:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET
```

Important:

Firebase web configuration values are not equivalent to server secrets, but Firestore security rules MUST protect the data.

Never expose:

- Cloudinary API secret
- Firebase Admin SDK credentials
- service account private key
- private signing credentials

Do not commit `.env`.

Commit:

```text
.env.example
```

---

# 45. Firebase Configuration

Create/configure:

```text
firebase.json
.firebaserc
firestore.rules
firestore.indexes.json
```

Use Firebase Hosting.

Keep the configuration compatible with a no-cost deployment.

Do not configure Cloud Functions.

Do not configure Firebase Storage as a required component.

---

# 46. Firestore Indexes

Only create indexes that are actually required.

Likely useful queries:

- products by category + active + sortOrder
- featured products
- popular products
- orders by createdAt/status

Avoid creating unnecessary indexes.

---

# 47. Demo Data Seeding

Create a reproducible seed mechanism.

Prefer a local/admin seed script that uses Firebase Admin SDK only during development/deployment and NEVER ships credentials to the browser.

Alternatively create a protected development-only import tool if necessary.

The demo dataset must be reproducible.

Include:

- store
- categories
- products
- demo settings
- sample orders only if useful for dashboard demonstration

Do not seed fake customer personal data.

Use obviously fictional demo customer names/phone numbers if sample orders are shown.

---

# 48. Demo Store Presentation

The demo must include enough content to demonstrate:

### Product gallery

At least several products with multiple images.

### Product video

At least a few products with video.

### Featured products

Several.

### Popular products

Several.

### Out-of-stock products

Several, so the UI demonstrates unavailable state.

### Discounted products

Several with:

```text
oldPrice
price
```

### Categories

All categories populated.

### Orders

A small number of clearly fictional sample orders for demonstrating the admin dashboard, if implemented.

---

# 49. No Placeholder Content

Before considering the project complete, search the source for:

```text
Lorem
Test
Product 1
Product 2
TODO
FIXME
placeholder
example.com
```

Remove customer-facing placeholder content.

Developer TODOs may remain only if they are genuinely required and documented.

---

# 50. Error Handling

Implement friendly Arabic errors.

Examples:

```text
حدث خطأ أثناء تحميل المنتجات.
حاول مرة أخرى.
```

```text
تعذر إرسال الطلب حالياً.
تحقق من اتصال الإنترنت وحاول مرة أخرى.
```

```text
هذا المنتج غير متاح حالياً.
```

Do not expose raw Firebase errors to customers.

Log useful technical errors appropriately without leaking secrets.

---

# 51. Empty States

Create polished empty states:

No search results:

```text
لم نجد منتجات مطابقة لبحثك.
جرب كلمة أخرى.
```

Empty cart:

```text
السلة فارغة
ابدأ بإضافة المنتجات التي تحتاجها.
```

No products:

```text
لا توجد منتجات في هذا القسم حالياً.
```

---

# 52. Loading States

Do not display blank screens while Firestore data loads.

Use skeleton loaders for:

- product cards
- categories
- store banner
- product details

Admin should also have appropriate loading states.

---

# 53. Storefront Routes

Implement approximately:

```text
/
 /category/:id
 /product/:id
 /search
 /cart
 /checkout
```

Admin:

```text
/admin/login
/admin
/admin/products
/admin/products/new
/admin/products/:id/edit
/admin/categories
/admin/orders
/admin/orders/:id
/admin/settings
```

Protect admin routes.

---

# 54. URL / Slug Design

Use readable URLs where practical.

Examples:

```text
/category/dairy
/category/grocery
/product/rice-eldoha-1kg
```

Arabic URLs are possible but do not require them.

Store should have a stable slug:

```text
abu-qir-grocery
```

---

# 55. White-Label Preparation

Although V1 is single-vendor, avoid hardcoding:

```text
بقالة أبو قير
```

throughout the application.

Store data must come from Firestore.

The demo store should simply be the initial store configuration.

The application should work if:

```text
store.name
```

changes.

The same applies to:

- logo
- banner
- colors
- WhatsApp number
- categories
- products

---

# 56. Future Multi-Vendor Compatibility

Do not implement multi-vendor UI.

But use:

```text
stores/{storeId}/products
stores/{storeId}/categories
stores/{storeId}/orders
```

rather than a globally hardcoded product structure if reasonable.

Store ID can initially be obtained from a configuration constant or route.

Keep the domain model ready for future extension.

---

# 57. Testing

Implement meaningful tests.

At minimum test:

- cart calculations
- quantity changes
- discount/oldPrice display
- delivery fee
- minimum order
- free delivery threshold
- WhatsApp message generation
- Arabic search normalization
- product availability
- authorization logic where testable

Do not waste time testing trivial CSS.

---

# 58. Validation

Validate:

- product price >= 0
- oldPrice >= price when supplied
- product name required
- category required
- customer name required
- valid phone format for Egypt
- address required if delivery is enabled
- quantity >= 1
- WhatsApp number valid
- delivery fee >= 0

Use friendly Arabic validation messages.

---

# 59. Egyptian Phone Numbers

Support common Egyptian mobile formats.

Normalize numbers before constructing WhatsApp links.

Accept examples such as:

```text
01012345678
01112345678
01212345678
01512345678
```

Convert to international format where required:

```text
201012345678
```

Do not assume every Egyptian number is mobile; make the validation sensible.

---

# 60. Currency Formatting

Use Egyptian locale formatting where appropriate.

Example:

```text
٤٢ جنيه
```

or:

```text
42 جنيه
```

Pick one style and keep it consistent.

Do not mix:

```text
42 EGP
42 جنيه
42 ج.م
```

randomly.

---

# 61. Store Hours

Support:

```text
openingHours
```

The storefront may display:

```text
مفتوح الآن
```

or:

```text
مغلق الآن
```

Only implement this if it can be done correctly using local time.

Do not falsely claim "open now" if the time configuration is missing.

---

# 62. Delivery UX

If delivery is enabled:

Show:

```text
رسوم التوصيل: 10 جنيه
```

If free delivery threshold is met:

```text
التوصيل مجاناً
```

If minimum order is not met:

```text
الحد الأدنى للطلب 100 جنيه
```

Disable final ordering until the requirement is satisfied, with a clear explanation.

---

# 63. Cart UX

Make cart accessible at all times.

Show cart item count.

When adding a product:

- update cart immediately
- show subtle confirmation
- don't force navigation

Avoid intrusive toast spam.

---

# 64. Product Image UX

Images should:

- use consistent aspect ratio
- avoid layout shift
- use object-fit appropriately
- have meaningful alt text
- lazy-load secondary images

Use Cloudinary responsive transformations.

Example conceptual URL strategy:

```text
f_auto,q_auto,w_400
```

Do not hardcode one enormous image for every viewport.

---

# 65. Video UX

Videos:

- muted by default
- poster image
- play controls
- lazy-load
- do not autoplay with sound
- keep short in demo
- optimize through Cloudinary

Do not load every product video on the home page.

---

# 66. Security Checklist

Before completion verify:

- no API secrets in frontend
- no Firebase Admin credentials in repository
- no Cloudinary secret in repository
- Firestore rules are restrictive
- admin routes require authentication
- customer cannot write product/store data
- vendor cannot access another store if store scoping is implemented
- `.env` is gitignored
- GitHub secrets are not printed in logs
- no credentials in seed data
- no service account JSON committed

---

# 67. SEO / Sharing

For the web version implement basic:

- title
- description
- Open Graph metadata where practical
- favicon
- manifest

Example title:

```text
بقالة أبو قير | كل احتياجات البيت
```

Product pages should have useful titles.

---

# 68. Desktop Vendor Experience

The admin dashboard should be especially good on desktop because vendors may manage products from a computer.

Use:

- sidebar
- data tables/cards
- bulk-friendly editing where useful
- image management
- clear navigation

Mobile admin must still work.

---

# 69. Customer Desktop Experience

Desktop storefront should remain polished.

Use a max-width container.

Do not stretch product cards across the entire screen.

A 4–6 column grid can be appropriate depending on width.

---

# 70. Demo Sales Readiness

Before declaring the project complete, manually inspect the application as if you were a grocery-store owner.

Ask:

1. Does it look like a real store?
2. Does the home page look professionally branded?
3. Are product images convincing?
4. Are prices believable?
5. Can I understand the app in 5 seconds?
6. Can I find a product quickly?
7. Can I add several products?
8. Is checkout obvious?
9. Is WhatsApp ordering obvious?
10. Does the vendor dashboard look like something I could actually use?
11. Can I add a product without technical knowledge?
12. Can I change its price?
13. Can I mark it unavailable?
14. Can I change my banner?
15. Can I change my store color?
16. Can I upload multiple product images?
17. Can I upload a product video?

If any answer is no, improve the implementation.

---

# 71. Important UX Rule

Do not make the application feel like an engineering demo.

Avoid showing technical concepts to users.

The vendor should see:

```text
المنتجات
الأقسام
الطلبات
الإعدادات
```

not:

```text
Firestore
Cloudinary
Document ID
Storage
API
```

The customer should never know which backend technology is being used.

---

# 72. Repository Structure

Use a clean structure similar to:

```text
/
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── android.yml
│
├── android/
│
├── public/
│   ├── icons/
│   └── manifest assets
│
├── src/
│   ├── app/
│   ├── components/
│   │   ├── ui/
│   │   ├── storefront/
│   │   ├── cart/
│   │   └── admin/
│   ├── features/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── store/
│   │   └── auth/
│   ├── firebase/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── types/
│   ├── data/
│   └── styles/
│
├── scripts/
│   └── seed-demo/
│
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
├── capacitor.config.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

Adjust if a better structure is technically justified.

---

# 73. Code Quality

Use:

- strict TypeScript
- reusable components
- clear naming
- small functions
- no giant components
- no duplicated business logic
- no magic strings where configuration/constants are more appropriate
- no unnecessary abstraction

Do not over-engineer.

---

# 74. Documentation

Create a useful README containing:

- project overview
- architecture
- local setup
- Firebase setup
- Cloudinary setup
- environment variables
- Firestore rules deployment
- demo data seeding
- local development
- Firebase deployment
- Android build
- GitHub Actions
- vendor setup
- security notes
- free-tier constraints

Include exact commands.

---

# 75. Development Process

Implement in logical milestones.

Recommended order:

## Milestone 1

Project setup:

- React
- Vite
- TypeScript
- routing
- styling
- RTL
- Firebase
- environment configuration

## Milestone 2

Design system:

- typography
- colors
- spacing
- buttons
- cards
- inputs
- responsive layout

## Milestone 3

Storefront:

- home
- categories
- products
- search
- product details

## Milestone 4

Cart/checkout:

- cart
- persistence
- checkout
- delivery calculation
- WhatsApp generation

## Milestone 5

Vendor:

- authentication
- dashboard
- products
- categories
- settings
- orders

## Milestone 6

Cloudinary:

- media upload
- image gallery
- video
- transformations

## Milestone 7

Demo store:

- branding
- 100–150 products
- images
- selected videos
- realistic prices
- demo orders

## Milestone 8

PWA + Android:

- PWA
- Capacitor
- Android
- GitHub Actions

## Milestone 9

Polish:

- performance
- accessibility
- loading
- errors
- empty states
- responsive fixes
- security review

---

# 76. Do Not Stop at a Skeleton

A common failure mode is implementing:

- basic Firebase
- 3 products
- plain cards
- generic admin
- placeholder images

and calling it complete.

Do NOT do that.

The acceptance target is a polished demo that can be shown to an actual Egyptian grocery vendor.

---

# 77. Definition of Done

The project is complete only when:

### Customer

- [ ] Arabic RTL storefront works
- [ ] mobile layout is polished
- [ ] desktop layout is polished
- [ ] store banner works
- [ ] store theme works
- [ ] categories work
- [ ] search works
- [ ] product cards work
- [ ] product detail works
- [ ] multiple product images work
- [ ] product videos work
- [ ] cart works
- [ ] cart persists
- [ ] checkout works
- [ ] delivery calculation works
- [ ] WhatsApp order generation works
- [ ] no customer account required

### Vendor

- [ ] Firebase authentication works
- [ ] protected admin routes work
- [ ] dashboard works
- [ ] product CRUD works
- [ ] product availability works
- [ ] category CRUD works
- [ ] multiple image upload works
- [ ] video upload works
- [ ] media reorder works
- [ ] store logo works
- [ ] store banner works
- [ ] theme configuration works
- [ ] WhatsApp number configuration works
- [ ] delivery settings work
- [ ] orders dashboard works

### Demo

- [ ] professional logo
- [ ] professional banner
- [ ] professional theme
- [ ] 100–150 realistic products
- [ ] realistic categories
- [ ] realistic demo prices
- [ ] high-quality product imagery
- [ ] multiple-image products
- [ ] several video products
- [ ] featured products
- [ ] popular products
- [ ] unavailable products
- [ ] discounted products
- [ ] sample dashboard orders where useful

### Infrastructure

- [ ] Firebase Hosting works
- [ ] Firestore works
- [ ] Firebase Auth works
- [ ] Cloudinary works
- [ ] no Firebase Storage dependency
- [ ] no Neon dependency
- [ ] no paid service dependency
- [ ] GitHub Actions web deployment works
- [ ] GitHub Actions Android build works
- [ ] APK artifact is produced
- [ ] security rules are deployed
- [ ] no secrets committed

### Quality

- [ ] no broken images
- [ ] no placeholder customer-facing content
- [ ] no console errors
- [ ] no TypeScript errors
- [ ] lint passes
- [ ] tests pass
- [ ] responsive design verified
- [ ] accessibility basics verified
- [ ] README complete

---

# 78. Important Implementation Decisions

If you encounter ambiguity:

1. Prefer the simplest architecture.
2. Prefer zero-cost services.
3. Prefer Firebase + Cloudinary.
4. Do not introduce Neon.
5. Do not introduce a paid service.
6. Do not introduce Cloud Functions unless absolutely unavoidable; redesign instead.
7. Do not require customer accounts.
8. Keep WhatsApp as the order communication channel.
9. Keep the UI Arabic-first and RTL.
10. Treat the demo store as a sales-quality product, not seed data.
11. Do not sacrifice security for convenience.
12. Do not put secrets in client code.
13. Do not over-engineer V1.
14. Build reusable components.
15. Make the application fast on low-end Android devices.

---

# 79. If You Need to Make a Tradeoff

Use this priority order:

```text
1. Security
2. Zero-budget requirement
3. Customer usability
4. Demo/sales quality
5. Mobile performance
6. Maintainability
7. Future extensibility
8. Nice-to-have features
```

Never sacrifice the first two for convenience.

---

# 80. Final Instruction

Implement the project completely.

Do not merely describe what should be implemented.

Inspect the repository before making changes.

If the repository is empty, initialize the project.

Create all required source files, configuration files, Firebase configuration, Firestore rules, Cloudinary integration, demo data, UI, tests, PWA configuration, Capacitor configuration, and GitHub Actions workflows.

Run the appropriate validation commands after implementation:

```text
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

If scripts differ, create appropriate scripts.

Fix errors rather than leaving them unresolved.

Do not stop after the first milestone.

Continue until the application reaches the Definition of Done.

At the end, provide a concise implementation report containing:

- what was implemented
- important architecture decisions
- files/directories created
- required environment variables
- Firebase setup steps
- Cloudinary setup steps
- demo store credentials/setup information, without exposing secrets
- local development commands
- deployment commands
- Android APK build instructions
- known limitations
- any remaining manual setup required

The final result should be a polished, credible, zero-budget grocery storefront that can be opened on a phone and demonstrated immediately to a real grocery vendor in Abu Qir.
