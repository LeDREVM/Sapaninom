# 📊 OXFOOD Dashboard — Architecture & Features

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────┐
│         OXFOOD Dashboard V2                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │   React Component Layer (UI)        │   │
│  │ - Home                              │   │
│  │ - Pricing                           │   │
│  │ - Cookbook                          │   │
│  │ - Clients Management                │   │
│  │ - Subscriptions Manager             │   │
│  └─────────────────────────────────────┘   │
│            ↓                                 │
│  ┌─────────────────────────────────────┐   │
│  │  State Management (React Hooks)     │   │
│  │ - useState / useEffect / useMemo    │   │
│  │ - localStorage persistence           │   │
│  └─────────────────────────────────────┘   │
│            ↓                                 │
│  ┌─────────────────────────────────────┐   │
│  │   Data Layer                        │   │
│  │ - Clients                           │   │
│  │ - Sessions                          │   │
│  │ - Subscriptions                     │   │
│  │ - Recipes (DrevmCook DB)            │   │
│  └─────────────────────────────────────┘   │
│            ↓                                 │
│  ┌─────────────────────────────────────┐   │
│  │   Storage (localStorage)            │   │
│  │ oxfood-clients-v2                   │   │
│  │ oxfood-sessions-v2                  │   │
│  │ oxfood-subscriptions-v2             │   │
│  │ oxfood-recipes-v2                   │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📱 Core Components

### 1. **Home Component**
**Purpose**: Dashboard overview & quick actions

**Features**:
- 📊 Stats grid (clients, subscriptions, sessions, revenue)
- 💰 Revenue breakdown (seances + subscriptions)
- ⭐ Active subscriptions list
- 🔥 Recent sessions
- Quick action buttons

**State Management**:
```javascript
- clients: []
- sessions: []
- subscriptions: []
- monthRev: number
- subRev: number
- totalMonthRev: number
```

---

### 2. **Pricing Component**
**Purpose**: Display tarification transparently

**Features**:
- 🏠 3 Core services (Placard→Assiette, Plats préparés, Revalorisation)
- 🍱 Menu options (Simple, Famille, Premium)
- ⭐ Subscription plans (1x/week, 2x/week, Custom)
- Toggle views (services / menus / subscriptions)

**Data Structure**:
```javascript
PRICING = {
  services: [{id, emoji, name, desc, base, range}],
  menus: [{id, name, price, servings}],
  subscriptions: [{id, name, visits, price, monthly, save}]
}
```

---

### 3. **Cookbook Component**
**Purpose**: Recipe database browsing & management

**Features**:
- 📖 35+ DrevmCook recipes
- 🔍 Search (by name, ingredients, tags)
- 🏷️ Filter by category (base, salé, desserts)
- ❤️ Favorites (togglable)
- Detail view with full recipe info

**Recipes Include**:
- Ingredients list
- Step-by-step preparation
- Difficulty level
- Time & servings
- Nutritional benefits
- Budget estimate
- Tips & variations

---

### 4. **Clients Component**
**Purpose**: Client database & segmentation

**Features**:
- 👥 Full client management
- 🎯 6 Client segments:
  - 💼 Actifs débordés
  - 👨‍👩‍👧‍👦 Familles
  - 🏡 Airbnb / Touristes
  - 🎨 Artistes / Créateurs
  - 💚 Health conscious
  - 🏢 Corporate events
- 📞 Contact info (phone, address)
- 📝 Notes & preferences
- 📊 Session counter per client

**Add/Edit Form**:
```javascript
{
  name: string*,
  segment: enum (6 types),
  phone: string,
  address: string,
  notes: string
}
```

---

### 5. **Subscriptions Component**
**Purpose**: Recurring revenue management

**Features**:
- ⭐ Create subscriptions
- 📅 Track start dates
- 💰 MRR calculation (Monthly Recurring Revenue)
- 📊 Subscription status display
- Client-plan association

**Subscription Object**:
```javascript
{
  id: string,
  clientId: string,
  clientName: string,
  planId: enum,
  planName: string,
  price: number,
  startDate: ISO string
}
```

---

## 💾 Data Models

### Client
```javascript
{
  id: string (uid),
  name: string,
  segment: enum ('active', 'family', 'airbnb', 'artists', 'health', 'corporate'),
  phone: string,
  address: string,
  notes: string
}
```

### Session
```javascript
{
  id: string (uid),
  date: ISO string,
  clientId: string,
  clientName: string,
  serviceType: enum ('placard', 'prepared', 'revaluation'),
  recipeName: string,
  amount: number (€),
  notes: string
}
```

### Subscription
```javascript
{
  id: string (uid),
  clientId: string,
  clientName: string,
  planId: enum ('weekly-1', 'weekly-2', 'monthly-custom'),
  planName: string,
  price: number (€/month),
  startDate: ISO string
}
```

### Recipe
```javascript
{
  id: string,
  category: enum ('base', 'salé', 'dessert', 'fermentation', 'boisson'),
  name: string,
  description: string,
  difficulty: enum ('Facile', 'Moyen', 'Avancé'),
  time_minutes: number,
  servings: number,
  vegan: boolean,
  glutenFree: boolean,
  ingredients: string[],
  steps: string[],
  budget: string,
  tips: string,
  nutrition: string[],
  tags: string[]
}
```

---

## 🎨 Design System

### Color Palette
```
Primary (Action)     : #FF6B35 (Orange)
Success (Wellness)   : #2EC4B6 (Teal)
Danger (Alert)       : #E71D36 (Red)
Premium (Money)      : #FF9F1C (Gold)
Background (Dark)    : #0F0F1A (Almost black)
Text (Light)         : #F5F0E8 (Beige)
Subtext (Gray)       : #888 / #666 / #555
```

### Typography
- **Font Family**: DM Sans (primary), Segoe UI (fallback)
- **Headings**: 800 weight
- **Body**: 400-700 weight

### Spacing System
```
xs = 4px
sm = 8px
md = 12px
lg = 16px
xl = 24px
```

---

## 🔄 State Flow & Lifecycle

### Initial Load
1. Component mounts
2. `useEffect` triggers storage load
3. `load()` function fetches from localStorage
4. State setters populate data
5. `setLoaded(true)` triggers UI render

### Adding Client
1. Form submission
2. `addClient(data)` called
3. New client with `uid()` generated
4. State updated
5. `useEffect` persists to storage

### Calculate MRR
```javascript
// Sessions revenue (current month)
thisMonth = sessions.filter(monthMatch)
monthRev = thisMonth.reduce((sum, session) => sum + session.amount)

// Subscriptions revenue (current month)
subRev = subscriptions.filter(monthMatch).reduce((sum, sub) => sum + sub.price)

// Total monthly
totalMonthRev = monthRev + subRev
```

---

## 🚀 Performance Optimizations

### useMemo
- `filtered` recipes (Cookbook)
- `dbMatch` suggestions (AI)

### useRef (ready for)
- Animation triggers
- Scroll position tracking

### Lazy Rendering
- Tabs only render active component
- Detail views replace list views

---

## 🔐 Security Considerations

### Current
- ✅ localStorage only (client-side)
- ✅ No external APIs
- ✅ No auth required (local use)

### To Implement
- ⏳ Firebase Auth (user login)
- ⏳ Data encryption (localStorage)
- ⏳ Backend validation (node.js API)
- ⏳ Rate limiting (API)

---

## 🧪 Testing Recommendations

### Unit Tests
- Add/edit/delete operations
- MRR calculations
- Filter logic

### Integration Tests
- Complete user flows (client → session → subscription)
- Storage persistence
- Data consistency

### E2E Tests
- Cypress / Playwright
- Full user journeys
- Mobile responsiveness

---

## 📦 Deployment Ready

### Build
```bash
npm run build  # Creates dist/ folder
```

### Deploy Targets
- Vercel (Next.js)
- Netlify (React SPA)
- GitHub Pages (static)
- Firebase Hosting
- AWS S3 + CloudFront

### Environment Setup
```javascript
.env
VITE_API_URL=...        // Future API endpoint
VITE_FIREBASE_CONFIG=... // Firebase config
```

---

## 📈 Metrics & Analytics

### Key Performance Indicators
- **CAC** (Cost per Acquisition): Coût d'acquisition client
- **LTV** (Lifetime Value): Valeur vie du client
- **MRR** (Monthly Recurring Revenue): Revenu mensuel récurrent
- **Churn Rate** (%) : Taux d'attrition
- **ARPU** (Average Revenue Per User): Revenu moyen par client
- **Conversion Rate** (): % clients → abonnés

### Dashboards to Add
- Revenue trends (chart.js / recharts)
- Client segmentation (pie chart)
- Subscription MRR forecast
- Seasonal analysis (summer vs winter)

---

## 🚀 Roadmap

### Phase 1 (Done)
✅ Core dashboard structure
✅ Client management
✅ Sessions tracking
✅ Subscriptions system
✅ Pricing display

### Phase 2 (Next)
⏳ Authentication (Firebase)
⏳ Backend API (Node.js/Express)
⏳ Database (Firestore/PostgreSQL)
⏳ Payment processing (Stripe)
⏳ Email notifications

### Phase 3 (Future)
⏳ Mobile app (React Native)
⏳ Booking calendar
⏳ Client app (order/track)
⏳ Chef app (route optimization)
⏳ AI recipe generator improvements
⏳ Analytics dashboard

---

**Last Updated**: May 2026  
**Status**: 🔥 Active Development  
**Maintainer**: LeDREVM
