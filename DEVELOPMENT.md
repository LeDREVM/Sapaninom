# 🚀 OXFOOD — Developer Guide

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Setup

```bash
# 1. Clone repo
git clone https://github.com/LeDREVM/Sapaninom.git
cd Sapaninom

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open browser
http://localhost:5173 (Vite)
```

---

## Project Structure

```
.
├── oxfood-dashboard-v2.jsx        ← 🔥 MAIN - Production ready
├── oxfood-dashboard.jsx           ← Original v1
├── README.md                       ← Overview
├── ARCHITECTURE.md                ← System design
├── DEVELOPMENT.md                 ← This file
├── package.json                   ← Dependencies
├── .gitignore                      ← Git config
└── vite.config.js                 ← Vite config (to create)
```

---

## Code Organization

### 1. **Component Structure** (in JSX file)

```javascript
// ═══════════════════════════════════════
// DATA & CONSTANTS
// ═══════════════════════════════════════
const DREVMCOOK_DB = [...]
const PRICING = {...}
const CLIENT_SEGMENTS = [...]
const SK = {...}  // Storage keys

// ═══════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════
async function load(k) {...}
async function save(k, d) {...}
const uid = () => {...}
const IC = {...}  // Icon components

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function OxfoodApp() {...}

// ═══════════════════════════════════════
// FEATURE COMPONENTS
// ═══════════════════════════════════════
function Home() {...}
function Pricing() {...}
function Cookbook() {...}
function Clients() {...}
function Subscriptions() {...}

// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════
const P = {...}
const H2 = {...}
// ... etc
```

### 2. **Adding a New Component**

```javascript
// 1. Define component
function MyFeature({ clients, sessions, setTab }) {
  const [state, setState] = useState([]);
  
  const handleAction = () => {
    // Logic here
  };

  return (
    <div style={P}>
      <h2 style={H2}>My Feature</h2>
      {/* JSX */}
    </div>
  );
}

// 2. Add to main app
export default function OxfoodApp() {
  // ...
  const tabs = [
    // ... existing tabs
    {id:"myfeature",icon:IC.plus,label:"My Feature"},
  ];
  
  return (
    <main>
      {tab==="myfeature"&&<MyFeature {...props}/>}
    </main>
  );
}

// 3. Add navigation button
<button onClick={()=>setTab("myfeature")}>Click me</button>
```

---

## Common Tasks

### Add New Pricing Option

```javascript
// In PRICING constant
subscriptions: [
  // ... existing
  {
    id:"weekly-3",
    name:"3x / semaine",
    visits:12,
    price:480,
    monthly:true,
    save:"25%"
  },
]
```

### Add New Client Segment

```javascript
// In CLIENT_SEGMENTS constant
{
  id:"vip",
  emoji:"👑",
  name:"VIP / High-value",
  desc:"Premium clients",
  pain:"Personalized experience",
  solution:"White-glove service"
},
```

### Add New Recipe

```javascript
// In DREVMCOOK_DB
{
  id:"dc-my-recipe",
  category:"salé",
  name:"My Awesome Recipe",
  description:"...",
  difficulty:"Facile",
  time_minutes:30,
  servings:4,
  vegan:true,
  glutenFree:true,
  ingredients:["ing1","ing2"],
  steps:["step1","step2"],
  budget:"10€",
  tips:"...",
  nutrition:["nutrient1"],
  tags:["tag1","tag2"]
},
```

### Add New Storage Key

```javascript
const SK = {
  clients:"oxfood-clients-v2",
  myData:"oxfood-mydata-v2",  // ← New
};
```

---

## Styling Guidelines

### Use Inline Styles (CSS-in-JS)

```javascript
// ✅ Good
const CARD = {
  background:"rgba(255,255,255,0.04)",
  borderRadius:12,
  padding:14,
  marginBottom:8
};

// ❌ Avoid
<div style={{background:"...",borderRadius:"...",}}>

// Apply
<div style={{...CARD, borderLeft:`4px solid #FF6B35`}}>
```

### Color System

```javascript
// Use established colors
const COLORS = {
  primary: "#FF6B35",    // Action
  success: "#2EC4B6",    // Wellness
  danger: "#E71D36",     // Alert
  premium: "#FF9F1C",    // Money
  bg: "#0F0F1A",         // Background
  text: "#F5F0E8",       // Text
  gray: "#888",          // Subtext
};
```

### Responsive Design

```javascript
// Use CSS-in-JS media queries workaround or:
// Set maxWidth on parent container
<div style={{maxWidth:480,margin:"0 auto"}}>
  {/* Content */}
</div>

// For mobile-first approach, use %/relative units
```

---

## State Management Patterns

### Simple State
```javascript
const [clients, setClients] = useState([]);

// Add
const addClient = (c) => setClients(p => [...p, {...c, id:uid()}]);

// Remove
const removeClient = (id) => setClients(p => p.filter(c => c.id !== id));

// Update
const updateClient = (id, data) => setClients(p => 
  p.map(c => c.id === id ? {...c, ...data} : c)
);
```

### Computed State
```javascript
const filtered = useMemo(() => {
  let l = DREVMCOOK_DB;
  if (cat !== "all") l = l.filter(r => r.category === cat);
  if (search) l = l.filter(r => r.name.includes(search));
  return l;
}, [cat, search]);  // ← Dependencies
```

### Effects (Side Effects)
```javascript
// Load on mount
useEffect(() => {
  (async () => {
    const data = await load("key");
    if (data) setState(data);
  })();
}, []);

// Save on change
useEffect(() => {
  if (loaded) save("key", state);
}, [state, loaded]);
```

---

## Performance Tips

### 1. Use useMemo for Expensive Calculations
```javascript
const expensiveResult = useMemo(() => {
  return largeArray.filter(...).map(...);
}, [dependency]);
```

### 2. Avoid Inline Objects in JSX
```javascript
// ❌ Bad - recreated each render
<div style={{color:"#FF6B35", padding:12}}>

// ✅ Good - defined once
const MYCARD = {color:"#FF6B35", padding:12};
<div style={MYCARD}>
```

### 3. Lazy Rendering
```javascript
// Only render active tab
{tab==="home" && <Home {...props}/>}
{tab==="clients" && <Clients {...props}/>}
// Not all tabs at once
```

---

## Testing

### Manual Testing Checklist

- [ ] Add client
- [ ] Edit client
- [ ] Delete client
- [ ] Create session
- [ ] Create subscription
- [ ] Verify MRR calculation
- [ ] Search recipes
- [ ] Filter recipes
- [ ] Switch tabs
- [ ] Data persists after reload

### localStorage Testing
```javascript
// In browser console
localStorage.getItem("oxfood-clients-v2")
localStorage.clear()  // Reset all
```

---

## Debugging

### 1. Console Logging
```javascript
useEffect(() => {
  console.log("Clients loaded:", clients);
}, [clients]);
```

### 2. React DevTools
- Install React DevTools extension
- Inspect component props/state
- Track re-renders

### 3. Network DevTools
- Check localStorage in Application tab
- Verify data persistence

---

## Git Workflow

### Feature Branch
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: Add my feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
```

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Restructure code
test: Add tests
chore: Update dependencies
```

---

## Deployment

### Build for Production
```bash
npm run build

# Output in dist/ folder
# Ready for deployment
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
# Follow prompts
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

---

## Environment Variables

Create `.env.local` for local development:

```
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_CONFIG={...}
```

Access in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Common Issues & Solutions

### Issue: Data not persisting
**Solution**: Check localStorage is not disabled, verify SK keys match

### Issue: Component not updating
**Solution**: Ensure state setter uses callback function `p => ...`

### Issue: Styles not applying
**Solution**: Verify CSS-in-JS object syntax, check style spreading

### Issue: Slow performance
**Solution**: Use useMemo for expensive operations, check for unnecessary re-renders

---

## Resources

### React Docs
- https://react.dev/
- https://react.dev/reference/react/useState
- https://react.dev/reference/react/useEffect

### Local Storage API
- https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

### Design System
- Color palette defined in ARCHITECTURE.md
- Spacing system: xs(4px), sm(8px), md(12px), lg(16px), xl(24px)

---

## Contributing

1. Fork the repo
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Commit with clear messages
6. Push and create PR

## Support

Questions? Open an issue on GitHub or contact LeDREVM

---

**Last Updated**: May 2026  
**Version**: 2.0  
**Maintainer**: LeDREVM
