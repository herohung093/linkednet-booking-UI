# LinkedNet Booking UI - Project Context

## Project Overview

**LinkedNet Booking UI** is a modern, responsive Next.js booking application for a nail salon. It allows customers to browse services, select staff members, choose dates and times, add multiple guests, and complete their booking with Google reCAPTCHA verification.

**Project Name:** nail-salon-booking-app  
**Version:** 0.1.0  
**Type:** Next.js 14.2.35 with React 18 (TypeScript)

## Tech Stack

### Core Framework & Language
- **Next.js 14.2.35** - React framework with built-in routing, API routes, and optimization
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Node.js** - Runtime environment

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Material-UI (MUI) 5.15.16** - Component library with icons
- **Radix UI** - Headless UI components for dialogs and alerts
- **Emotion** - CSS-in-JS styling library

### State Management & Forms
- **Redux Toolkit 2.2.3** - Global state management
- **React-Redux 9.1.2** - Redux bindings for React
- **React Hook Form 7.52.2** - Efficient form handling

### HTTP & Data Fetching
- **Axios** - HTTP client for API requests
- **SWR 2.2.5** - React hooks for data fetching with caching

### Date & Time
- **Moment.js 2.30.1** - Date/time manipulation
- **React DatePicker 6.9.0** - Date selection component

### UI Components & Interactions
- **Swiper 11.1.1** - Touch slider/carousel functionality
- **React Swipeable 7.0.1** - Gesture detection
- **React Select 5.8.0** - Searchable dropdown component
- **Lucide React 0.358.0** - Icon library
- **React IMask 7.6.1** - Input masking for forms

### Security & Verification
- **Google reCAPTCHA v3** - Bot protection
- **React Google reCAPTCHA v3 1.10.1** - Integration component

### Deployment
- **Firebase Hosting** - App hosting and database
- **Firebase Tools 15.0.0** - Firebase CLI
- **Google Analytics 4** - Analytics tracking

## Project Structure

```
linkednet-booking-UI/
├── components/          # Reusable React components
│   ├── AlertDeleteDialog.tsx
│   ├── AlertSuccessful.tsx
│   ├── BookingCart.tsx           # Shopping cart display
│   ├── BookingTypeSelection.tsx  # Group vs Individual booking
│   ├── Cart.tsx
│   ├── CartDialog.tsx
│   ├── CartSide.tsx              # Side cart panel
│   ├── CustomAlertDialog.tsx     # Custom alert dialogs
│   ├── CustomDateRadio.tsx       # Date selection
│   ├── CustomHourRadio.tsx       # Time selection
│   ├── CustomStaffRadio.tsx      # Staff member selection
│   ├── Error.tsx                 # Error display component
│   ├── Home.tsx                  # Home page component
│   ├── Loading.tsx               # Loading spinner
│   ├── Logo.tsx
│   ├── Navbar.tsx                # Top navigation bar
│   ├── OpeningTime.tsx           # Store hours display
│   ├── ResultsGallery.tsx        # Service/gallery display
│   ├── ServiceItemCard.tsx       # Individual service card
│   ├── ServiceSelection.tsx      # Service category selection
│   ├── StoreInfo.tsx             # Store information display
│   └── StoreMap.tsx              # Store location map
│
├── icons/              # Custom SVG icon components
│   ├── AddIcon.tsx
│   ├── Back.tsx
│   ├── CartIcon.tsx
│   ├── CheckIcon.tsx
│   ├── HomeIcon.tsx
│   ├── Horizon.tsx
│   ├── StarIcon.tsx
│   ├── TriangleDown.tsx
│   └── TriangleUp.tsx
│
├── layout/
│   └── layout.tsx      # App layout wrapper
│
├── pages/              # Next.js pages (file-based routing)
│   ├── _app.tsx        # App wrapper with providers
│   ├── _document.tsx   # HTML document structure
│   ├── index.tsx       # Home/service selection page
│   ├── add-guests.tsx  # Add additional guests page
│   ├── confirmation.tsx # Booking confirmation page
│   ├── privacy.tsx     # Privacy policy page
│   ├── staff.tsx       # Staff selection page
│   ├── terms-of-service.tsx
│   └── time.tsx        # Date & time selection page
│
├── redux toolkit/      # Redux state management
│   ├── store.ts        # Redux store configuration
│   ├── cartSlice.ts    # Cart state (guests, services)
│   ├── staffSlice.ts   # Staff selection state
│   └── storeInfo.ts    # Store information state
│
├── styles/
│   └── globals.css     # Global styles (Tailwind imports)
│
├── types/
│   └── global.d.ts     # Global TypeScript interfaces
│
├── ulti/               # Utilities
│   └── axios.tsx       # Axios instance with base URL
│
├── public/             # Static assets
│   └── icons/
│
├── firebase.json       # Firebase configuration
├── next.config.mjs     # Next.js configuration
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── postcss.config.mjs  # PostCSS configuration
└── package.json        # Dependencies and scripts
```

## Key Data Structures & Types

### ServiceItem
```typescript
interface ServiceItem {
  id: number;
  serviceName: string;
  serviceDescription: string;
  servicePrice: number;
  estimatedTime: number;
  serviceType: ServiceType;
  displayOrder: number;
  active: boolean;
}
```

### Guest
```typescript
interface Guest {
  id: number | null;
  name: string;
  guestServices: GuestService[] | null;
  totalPrice: number;
  totalEstimatedTime: number;
}
```

### GuestService
```typescript
interface GuestService {
  serviceItem: ServiceItem;
  staff: Staff | null;
}
```

### ServiceType
```typescript
interface ServiceType {
  id: number;
  type: string;
  levelType: number;
  description: string;
  displayOrder: number;
}
```

### Staff
Details in `types/global.d.ts` - includes staff member information for service assignment

## Redux State Structure

### store.ts
Three main slices configured:

1. **cartSlice** - Manages:
   - Current guest information
   - All guests in the booking
   - Is group booking flag
   - Guest services selection

2. **staffSlice** - Manages:
   - Selected staff members for services

3. **storeInfo** - Manages:
   - Store UUID
   - Store information (hours, location, details)
   - Service data

## Routing & Pages

The app follows a sequential booking flow:

1. **`/`** (Home/index.tsx) - Service selection and store info
2. **`/staff.tsx`** - Staff member selection
3. **`/time.tsx`** - Date and time selection
4. **`/add-guests.tsx`** - Additional guest management
5. **`/confirmation.tsx`** - Booking confirmation
6. **`/privacy.tsx`** - Privacy policy
7. **`/terms-of-service.tsx`** - Terms of service

## Environment Configuration

- **`.env.development`** - Development environment variables
  - `NEXT_PUBLIC_BASE_URL` - API base URL (defaults to http://localhost:8080 in development)
  - Used by axios utility for API requests

## API Integration

- **API Base:** Configured via `NEXT_PUBLIC_BASE_URL` environment variable
- **HTTP Client:** Custom Axios instance in `ulti/axios.tsx`
- **Data Fetching:** Uses SWR for client-side caching and Axios for direct requests

## Third-Party Integrations

### Google reCAPTCHA v3
- **Provider Key:** Configured in `_app.tsx`
- **Purpose:** Bot protection during booking
- **Key:** `6LeYggQqAAAAAPJ9aKFdqTOKj_Yr77myhhCS2sg-`

### Google Analytics
- **Tracking ID:** G-9YEEVK03WR
- **Purpose:** User behavior and conversion tracking

### Firebase
- **Project:** `big-umbrella-booking`
- **Used for:** Backend services and hosting
- **Deploy Command:** `npx firebase-tools deploy --project big-umbrella-booking`

## UI Components Overview

### Navigation
- **Navbar** - Top navigation bar with logo and links
- **StoreMap** - Embedded store location

### Forms & Input
- **CustomDateRadio** - Date picker component
- **CustomHourRadio** - Time picker component
- **CustomStaffRadio** - Staff member selection
- **BookingTypeSelection** - Group vs Individual booking toggle

### Cart & Booking
- **BookingCart** - Cart display with selected services
- **CartSide** - Sidebar cart view
- **CartDialog** - Modal cart view
- **ServiceItemCard** - Individual service display with price/duration

### Dialogs & Alerts
- **CustomAlertDialog** - Reusable alert dialog
- **AlertDeleteDialog** - Confirmation for deletions
- **AlertSuccessful** - Success message display

### Content Display
- **ResultsGallery** - Service gallery/results grid
- **StoreInfo** - Store hours and information
- **ServiceSelection** - Service category/type selector
- **OpeningTime** - Store opening hours display

## Build & Deployment

### Development
```bash
npm run dev
```
Starts development server on http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Firebase Deployment
```bash
npx firebase-tools deploy --project big-umbrella-booking
```

## Configuration Files

- **`next.config.mjs`** - Next.js config with image optimization (Unsplash domains allowed)
- **`tsconfig.json`** - TypeScript strict mode and path aliases
- **`tailwind.config.ts`** - Tailwind CSS theme and customization
- **`postcss.config.mjs`** - PostCSS with Tailwind plugin
- **`firebase.json`** - Firebase deployment configuration

## Key Features

1. **Service Selection** - Browse and select services with categories
2. **Staff Assignment** - Choose preferred staff members for each service
3. **Date & Time Selection** - Pick booking date and time with availability
4. **Multi-Guest Booking** - Add multiple guests to single booking
5. **Shopping Cart** - Real-time cart with price and time calculations
6. **Responsive Design** - Mobile-first with Tailwind CSS
7. **Form Validation** - React Hook Form with input masking
8. **Security** - Google reCAPTCHA v3 protection
9. **Analytics** - Google Analytics 4 tracking

## Code Style & Standards

- **Language:** TypeScript (strict mode)
- **Component Format:** Functional components with hooks
- **Styling:** Combination of Tailwind, Emotion, and MUI
- **State Management:** Redux Toolkit with slices
- **Forms:** React Hook Form
- **Testing:** ESLint configured

## Current Version & Dependencies

- Node.js compatible runtime
- Latest security patches via axios >=1.12.0
- React 18 with concurrent features support
- Next.js 14 with App Router compatible structure (using Pages Router)

## Important Notes

- The project uses **Pages Router** (not App Router)
- Global CSS imports in `_app.tsx` for Swiper and custom styles
- Images configured for Unsplash CDN only
- React Strict Mode enabled for development
- All API communication goes through configured axios instance

---

This context document is designed to help Claude Code understand the project structure, dependencies, and data flow for efficient code assistance.
