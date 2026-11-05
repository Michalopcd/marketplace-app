# Marketplace MVP – Design Doc

**Data:** 2026-11-13  
**Status:** Draft (oczekuje na akceptację)  
**Autor:** Claude (Superpowers Brainstorming)

---

## 1. Intent & Why

Budujemy **MVP (Minimum Viable Product) dla Marketplace** — aplikację internetową umożliwiającą użytkownikom kupowanie i sprzedawanie przedmiotów, inspirowaną Vinted ale z własnym wyglądem i interfejsem.

**Dlaczego teraz:** Potrzebujesz działającego prototypu, który zweryfikuje główne funkcjonalności (auth, listings, search, favorites) zanim inwestujesz w pełną aplikację.

**Sukces = MVP, które:**
- Umożliwia rejestrację i logowanie
- Pozwala na dodawanie/edytowanie/usuwanie ogłoszeń
- Umożliwia przeglądanie produktów z wyszukiwaniem i filtrami
- Wspiera ulubionych i profil użytkownika
- Działa responsywnie na mobile i desktop
- Jest bezpieczne i skalowalne

---

## 2. Goals, Non-Goals, Anti-Goals

### ✅ Goals (co chcemy osiągnąć)
- Pełna rejestracja/logowanie z Firebase Auth
- CRUD dla ogłoszeń (Create, Read, Update, Delete)
- Wyszukiwanie i filtrowanie produktów
- System ulubionych
- Profil użytkownika z edycją
- Responsywny interfejs (mobile-first)
- Bezpieczne przechowywanie danych w Firestore
- Zdjęcia produktów w Firebase Cloud Storage

### ❌ Non-Goals (co NIE robimy w MVP)
- Checkout/płatności (przyszła faza)
- Messaging/czat między użytkownikami (przyszła faza)
- Admin panel (przyszła faza)
- Rekomendacje ML (przyszła faza)
- Oceny i recenzje (przyszła faza)

### 🚫 Anti-Goals (co byłoby błędem)
- Kopiowanie wyglądu Vinted
- Instalacja zbędnych bibliotek
- Firebase dla wszystkiego bez planu migracji
- Zaniedbanie responsywności
- Sekrety w kodzie (.env w git)

---

## 3. Constraints

### Techniczne
- **Frontend:** React 19.3, TypeScript, Vite
- **UI:** Tailwind CSS (zero CSS framework)
- **State:** Redux (z Redux Toolkit dla uproszczenia)
- **Routing:** React Router v7
- **Auth:** Firebase Authentication (JWT)
- **Database:** Firebase Firestore (NoSQL)
- **Storage:** Firebase Cloud Storage (obrazy)
- **Testing:** Vitest + React Testing Library (przyszłe fazy)

### Organizacyjne
- Brak nowych bibliotek bez akceptacji
- Plan implementacji podzielony na sprinty
- Figma mockups przed kodem React
- Brak Firebase bez wyraźnej akceptacji ✅ (potwierdzono)
- Brak git commit/push do czasu akceptacji

### Bezpieczeństwa
- JWT tokens w localStorage (Firebase standard)
- Firestore Security Rules do kontroli dostępu
- Brak sekretów w kodzie
- Input validation (frontend + backend rules)

---

## 4. Architektura

### 4.1 Diagramu przepływu

```
Frontend (React + Redux)
    ↓
React Router (routing)
    ↓
Firebase SDK
    ↓
Firebase Auth (JWT) + Firestore (DB) + Cloud Storage (Images)
```

### 4.2 Layer Architecture

```
UI Layer (Components)
    ↓
Redux Store (State Management)
    ↓
Firebase Services (API Integration)
    ↓
Firebase Backend (Auth, DB, Storage)
```

### 4.3 Data Flow

```
User Action (kliknięcie) 
    → Component
    → Redux Action
    → Reducer
    → Firebase Query/Mutation
    → Firestore/Auth Update
    → Redux State Update
    → Component Re-render
```

---

## 5. Struktura katalogów `src/`

```
src/
├── pages/                          # Strony (routed components)
│   ├── Home.tsx                    # Strona główna
│   ├── Marketplace.tsx             # Lista produktów
│   ├── ProductDetails.tsx          # Szczegóły produktu
│   ├── Auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── Profile.tsx                 # Profil użytkownika
│   ├── CreateListing.tsx           # Dodawanie ogłoszenia
│   ├── Favorites.tsx               # Ulubione
│   └── NotFound.tsx
│
├── components/                     # Komponenty wielokrotnego użytku
│   ├── Navigation.tsx              # Navbar
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── SearchBar.tsx
│   ├── Filters.tsx
│   ├── AuthForm.tsx
│   └── LoadingSpinner.tsx
│
├── redux/                          # Redux Store
│   ├── store.ts                    # Configure store
│   ├── slices/
│   │   ├── authSlice.ts            # Auth state (user, token, isLoading)
│   │   ├── listingsSlice.ts        # Listings state (list, current, filters)
│   │   ├── userSlice.ts            # User state (profile, listings)
│   │   ├── favoritesSlice.ts       # Favorites state
│   │   └── searchSlice.ts          # Search state (query, filters)
│   └── hooks.ts                    # useAppDispatch, useAppSelector
│
├── services/                       # Firebase & API Integration
│   ├── firebase.ts                 # Firebase config
│   ├── authService.ts              # Auth operations (login, register, logout)
│   ├── listingsService.ts          # CRUD for listings
│   ├── userService.ts              # User profile operations
│   ├── favoritesService.ts         # Favorites operations
│   ├── storageService.ts           # Cloud Storage for images
│   └── firestoreRules.ts           # Security rules (config)
│
├── hooks/                          # Custom hooks
│   ├── useAuth.ts                  # Auth state & methods
│   ├── useListings.ts              # Listings data & methods
│   ├── useFavorites.ts             # Favorites state & methods
│   └── useFirebaseListener.ts      # Real-time data
│
├── types/                          # TypeScript types & interfaces
│   ├── auth.ts                     # User, AuthState
│   ├── listing.ts                  # Listing, ListingFilters
│   ├── firebase.ts                 # Firebase config types
│   └── store.ts                    # Redux state types
│
├── utils/                          # Utility functions
│   ├── validation.ts               # Form validation
│   ├── formatting.ts               # Date, price formatting
│   └── constants.ts                # APP_NAME, CATEGORIES, etc
│
├── styles/                         # Tailwind globals
│   └── globals.css                 # Tailwind directives + custom
│
├── App.tsx                         # Main component
├── main.tsx                        # Entry point
└── vite-env.d.ts                   # Vite types
```

---

## 6. Redux Store Structure

### Store State Tree

```typescript
{
  auth: {
    user: User | null,           // Zalogowany użytkownik
    isLoading: boolean,           // Auth loading state
    error: string | null,
  },
  
  listings: {
    items: Listing[],             // Wszystkie produkty
    current: Listing | null,      // Wybrany produkt
    isLoading: boolean,
    error: string | null,
    filters: {                     // Aktualne filtry
      category: string,
      minPrice: number,
      maxPrice: number,
      condition: string,
    },
  },
  
  user: {
    profile: UserProfile | null,  // Profil zalogowanego
    myListings: Listing[],        // Moje ogłoszenia
    isLoading: boolean,
  },
  
  favorites: {
    items: string[],              // Array of listing IDs
    isLoading: boolean,
  },
  
  search: {
    query: string,
    filters: SearchFilters,
    results: Listing[],
    isLoading: boolean,
  },
}
```

### Redux Slices (z Redux Toolkit)

```typescript
// authSlice.ts
- loginUser(email, password)
- registerUser(email, password, name)
- logoutUser()
- setUser(user)
- setLoading(boolean)
- setError(error)

// listingsSlice.ts
- setListings(listings[])
- setCurrentListing(listing)
- addListing(listing)
- updateListing(id, updates)
- deleteListing(id)
- setFilters(filters)
- setLoading(boolean)

// userSlice.ts
- setProfile(profile)
- updateProfile(updates)
- setMyListings(listings[])
- setLoading(boolean)

// favoritesSlice.ts
- addFavorite(listingId)
- removeFavorite(listingId)
- setFavorites(ids[])

// searchSlice.ts
- setQuery(query)
- setFilters(filters)
- setResults(listings[])
- clearSearch()
```

---

## 7. Firestore Database Schema

### Collections & Documents

```
/users
  /{userId}
    - email: string
    - name: string
    - avatar: string (URL)
    - bio: string
    - createdAt: Timestamp
    - updatedAt: Timestamp

/listings
  /{listingId}
    - userId: string (reference to /users)
    - title: string
    - description: string
    - price: number
    - category: string (enum: "fashion", "electronics", "home", etc)
    - condition: string (enum: "new", "like-new", "good", "fair")
    - size: string (optional, for fashion)
    - images: string[] (URLs from Cloud Storage)
    - isSold: boolean
    - createdAt: Timestamp
    - updatedAt: Timestamp

/favorites
  /{userId}
    - listings: string[] (array of listing IDs)
    - updatedAt: Timestamp
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users: read all, write own
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    
    // Listings: read all, write own
    match /listings/{listingId} {
      allow read: if true;
      allow create: if request.auth.uid != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    
    // Favorites: read own, write own
    match /favorites/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## 8. Routing Structure (React Router v7)

```typescript
Routes:

/                              → Home (public)
/marketplace                   → Marketplace/List (public)
/product/:id                   → ProductDetails (public)

/auth/login                    → Login (public, redirect if logged)
/auth/register                 → Register (public, redirect if logged)

/profile                       → Profile (protected)
/profile/edit                  → EditProfile (protected)
/profile/my-listings           → MyListings (protected)

/listing/create                → CreateListing (protected)
/listing/:id/edit              → EditListing (protected)

/favorites                     → Favorites (protected)

/*                             → NotFound
```

### Protected Routes Implementation

```typescript
// ProtectedRoute component
<ProtectedRoute>
  <Profile />
</ProtectedRoute>

// Logic: Sprawdzaj auth.user z Redux
// Jeśli brak → redirect na /auth/login
```

---

## 9. Firebase Authentication Flow

### Registration

```
1. User fills form (email, password, name)
   ↓
2. Frontend validates input
   ↓
3. Firebase.auth.createUserWithEmailAndPassword(email, password)
   ↓
4. Create user doc in /users collection
   ↓
5. Store JWT token w localStorage (Firebase automatic)
   ↓
6. Redux dispatch setUser(user)
   ↓
7. Redirect na /profile
```

### Login

```
1. User fills form (email, password)
   ↓
2. Firebase.auth.signInWithEmailAndPassword(email, password)
   ↓
3. Store JWT token (Firebase automatic)
   ↓
4. Redux dispatch setUser(user)
   ↓
5. Redirect na / lub ostatnią stronę
```

### Logout

```
1. Firebase.auth.signOut()
   ↓
2. Clear localStorage
   ↓
3. Redux dispatch logoutUser()
   ↓
4. Redirect na /
```

### Auth Persistence

```
// useEffect w App.tsx lub root layout
Firebase.auth.onAuthStateChanged((user) => {
  if (user) {
    dispatch(setUser(user))
  } else {
    dispatch(logoutUser())
  }
})
```

---

## 10. API Integration Pattern

### Listing Creation (example)

```typescript
// Component: CreateListing.tsx
const handleSubmit = async (formData) => {
  dispatch(setLoading(true))
  
  try {
    // 1. Upload images to Firebase Cloud Storage
    const imageUrls = await storageService.uploadImages(
      auth.user.uid,
      formData.images
    )
    
    // 2. Create document in /listings
    const listingRef = await listingsService.createListing({
      userId: auth.user.uid,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      condition: formData.condition,
      images: imageUrls,
      createdAt: new Date(),
    })
    
    // 3. Update Redux
    dispatch(addListing(newListing))
    
    // 4. Redirect to product page
    navigate(`/product/${listingRef.id}`)
    
  } catch (error) {
    dispatch(setError(error.message))
  } finally {
    dispatch(setLoading(false))
  }
}
```

### Real-time Listings Listener (example)

```typescript
// Service: listingsService.ts
export const subscribeToListings = (callback) => {
  const q = query(
    collection(db, 'listings'),
    where('isSold', '==', false),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const listings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(listings)
  })
}

// Hook: useListings.ts
useEffect(() => {
  const unsubscribe = subscribeToListings((listings) => {
    dispatch(setListings(listings))
  })
  return unsubscribe
}, [])
```

---

## 11. Komponenty — Top Level

### Pages
- **Home** — Navbar, hero, featured products, categories, footer
- **Marketplace** — Search, filters, product grid, pagination
- **ProductDetails** — Gallery, title/price/desc, seller info, add to favorites
- **Auth/Login & Register** — Forms, validation, error messages
- **Profile** — User info, my listings, edit profile
- **CreateListing** — Form, image upload, submit
- **Favorites** — Grid of saved products

### Shared Components
- **Navigation** — Logo, search, nav links, profile menu
- **ProductCard** — Image, title, price, favorite button
- **ProductGrid** — Responsive grid of cards
- **SearchBar** — Search input, category filter
- **Filters** — Price range, condition, size (conditional)
- **AuthForm** — Email, password, submit (reusable for login/register)
- **LoadingSpinner** — Loading states
- **Footer** — Links, social, copyright

---

## 12. Responsywność (Mobile-First)

### Tailwind Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Key Responsive Patterns
- Navbar: Hamburger menu na mobile, full nav na desktop
- Product Grid: 1 column (mobile) → 2 (tablet) → 3-4 (desktop)
- Forms: 100% width na mobile, max-w-md na desktop
- Product Details: Vertical layout (mobile) → Side-by-side (desktop)

---

## 13. Obsługa błędów & Loading States

### Global Error Handling
```typescript
// errorSlice.ts (opcjonalnie) lub w każdym slice
try {
  // async operation
} catch (error) {
  dispatch(setError(error.message))
  // Show toast/modal
}
```

### Loading States
- `isLoading: boolean` w każdym slice
- Disable buttons during load
- Show spinners
- Disable inputs

### UI States
- **Loading:** Spinner
- **Empty:** "Brak produktów" message
- **Error:** Error message + retry button
- **Success:** Toast/notification

---

## 14. Tailwind CSS Setup

### globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom theme colors */
@layer components {
  .btn-primary { @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 }
  .btn-secondary { @apply bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 }
  .card { @apply bg-white rounded-lg shadow-md p-4 }
}
```

### Usage
```tsx
<button className="btn-primary">Submit</button>
<div className="card md:grid-cols-2 gap-4">...</div>
```

---

## 15. Co zostaje do builder'a (implementacji)

### Frontend (React + TypeScript)
- [ ] Implementacja wszystkich komponentów
- [ ] Redux store setup z Redux Toolkit
- [ ] React Router routing
- [ ] Tailwind CSS konfiguracja
- [ ] Form validation (Formik lub React Hook Form)
- [ ] Image optimization & lazy loading
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Testing z Vitest + RTL

### Firebase Setup
- [ ] Firebase project creation
- [ ] Authentication rules
- [ ] Firestore collections & security rules
- [ ] Cloud Storage bucket & rules
- [ ] Environment variables (.env)

### Polish & Deployment
- [ ] Responsywne testy na rzeczywistych urządzeniach
- [ ] Performance optimization
- [ ] SEO (jeśli potrzebny)
- [ ] Hosting (Firebase Hosting / Vercel / Netlify)

---

## Approaches (decyzje podjęte)

### Co rozważaliśmy?

| Decyzja | Opcja A | Opcja B | Opcja C | **Wybrana** |
|---------|---------|---------|---------|-----------|
| Backend | Firebase | Node+SQL | Python+SQL | **Firebase** |
| State | Redux | Zustand | Context | **Redux** |
| UI | Tailwind | CSS Modules | Styled-Components | **Tailwind** |
| Routing | React Router | TanStack | Vike | **React Router** |
| Auth | JWT | Sessions | OAuth | **Firebase JWT** |
| Storage | Firebase | AWS S3 | własny | **Firebase** |

### Dlaczego Firebase?
✅ Szybka setup (brak backendu do napisania w MVP)  
✅ Skalowalna (serverless)  
✅ Bezpieczna (security rules)  
✅ Integrated auth + storage  
⚠️ Vendor lock-in (ale do przeanalizowania w przyszłości)

---

## 16. Timeline estimate

| Sprint | Zadania | Estimated |
|--------|---------|-----------|
| Sprint 1 | Setup + Auth (login/register) | 1 week |
| Sprint 2 | Profile + User management | 1 week |
| Sprint 3 | Listings CRUD + uploads | 1.5 weeks |
| Sprint 4 | Search + Filters | 1 week |
| Sprint 5 | Favorites + Home page | 1 week |
| Sprint 6 | Responsive polish + Figma review | 1 week |
| **Total MVP** | | **~6-7 weeks** |

---

## 17. Firebase Security Rules (szczegółowo)

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper: check if user is authenticated
    function isAuthenticated() {
      return request.auth.uid != null;
    }
    
    // Helper: check if user owns resource
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // USERS: Read all (public profiles), write own
    match /users/{userId} {
      allow read: if true;
      allow create: if isOwner(userId) && request.auth.uid != null;
      allow update, delete: if isOwner(userId);
      
      // Allowed fields on create/update
      allow write: if request.resource.data.keys().hasAll(['email', 'name']) &&
                      request.resource.data.keys().hasOnly([
                        'email', 'name', 'avatar', 'bio', 'createdAt', 'updatedAt'
                      ]);
    }
    
    // LISTINGS: Read all (public), create own, update/delete own
    match /listings/{listingId} {
      allow read: if true;
      
      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.keys().hasAll([
                         'userId', 'title', 'description', 'price', 'category'
                       ]);
      
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
      
      // Validation: price > 0, title not empty
      allow write: if request.resource.data.price > 0 &&
                      request.resource.data.title.size() > 0 &&
                      request.resource.data.title.size() <= 100;
    }
    
    // FAVORITES: Read/write own only
    match /favorites/{userId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

### Zabezpieczenie operacji

**Tworzenie ogłoszenia:**
- Tylko zalogowani użytkownicy
- `userId` w dokumencie = `request.auth.uid`
- Walidacja: tytuł (1-100 znaków), opis (1-5000), cena > 0

**Edycja ogłoszenia:**
- Tylko właściciel (`listing.userId == auth.uid`)
- Nie można zmienić `userId`

**Usuwanie ogłoszenia:**
- Tylko właściciel

**Ulubionych:**
- Tylko zalogowany użytkownik może odczytać/modyfikować swoje

---

## 18. Walidacja, rozmiary i przechowywanie zdjęć

### Frontend Validation (React Hook Form + Zod)

```typescript
// zod schema
const ListingSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(5000),
  price: z.number().min(0.01).max(999999),
  category: z.enum(['fashion', 'electronics', 'home', 'sports', 'other']),
  condition: z.enum(['new', 'like-new', 'good', 'fair']),
  size: z.string().optional(),
  images: z.array(z.instanceof(File))
    .min(1, "Minimum 1 zdjęcie")
    .max(10, "Maksimum 10 zdjęć"),
});

// React Hook Form + validation
const form = useForm<z.infer<typeof ListingSchema>>({
  resolver: zodResolver(ListingSchema),
});
```

### Zdjęcia - rozmiary i przechowywanie

**Frontend:**
- Maksimum 10 zdjęć na ogłoszenie
- Max rozmiar pliku: 5 MB
- Formaty: JPG, PNG, WebP
- Resize na 1200x900 przed upload (lossy compression)
- Thumbnail 400x300

**Cloud Storage struktura:**
```
/users/{userId}/listings/{listingId}/
  - image_0.jpg (1200x900)
  - image_0_thumb.jpg (400x300)
  - image_1.jpg
  - image_1_thumb.jpg
  ...
```

**Cloud Storage Security Rules:**
```javascript
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/listings/{listingId}/{allPaths=**} {
      // Allow owner to upload (during listing creation)
      allow read: if true;
      allow write: if request.auth.uid == userId &&
                      request.resource.size < 5 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## 19. Wyszukiwanie, filtrowanie, sortowanie, paginacja

### Search Implementation (Firestore Queries)

```typescript
// Basic search + filters
const searchListings = async (query: string, filters: SearchFilters) => {
  let q = collection(db, 'listings');
  
  let constraints = [
    where('isSold', '==', false),
  ];
  
  // Filter by category
  if (filters.category) {
    constraints.push(where('category', '==', filters.category));
  }
  
  // Filter by price range
  if (filters.minPrice) {
    constraints.push(where('price', '>=', filters.minPrice));
  }
  if (filters.maxPrice) {
    constraints.push(where('price', '<=', filters.maxPrice));
  }
  
  // Filter by condition
  if (filters.condition) {
    constraints.push(where('condition', '==', filters.condition));
  }
  
  // Sort by (createdAt desc default, price asc/desc optional)
  if (filters.sortBy === 'price_asc') {
    constraints.push(orderBy('price', 'asc'));
  } else if (filters.sortBy === 'price_desc') {
    constraints.push(orderBy('price', 'desc'));
  } else {
    constraints.push(orderBy('createdAt', 'desc'));
  }
  
  // Pagination (limit 20 per page)
  constraints.push(limit(20));
  
  const builtQuery = query(collection(db, 'listings'), ...constraints);
  const snapshot = await getDocs(builtQuery);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

### Full-text Search (limitations)

⚠️ **Firestore limitation:** Brak natywnego full-text search (title LIKE 'test')

**Rozwiązania:**
1. **Elasticsearch** (zbyt heavy dla MVP)
2. **Algolia** (paid)
3. **Client-side filtering** (for MVP) — fetchuj listy, filteruj w JS
4. **Firestore text search** — create `title_lowercase` field, query `startsWith()`

**MVP approach:** Client-side filtering + `startsWith()` dla szybkiego startu

```typescript
// Simple text search on loaded data
const filteredListings = listings.filter(listing =>
  listing.title.toLowerCase().includes(query.toLowerCase())
);
```

### Paginacja

```typescript
// Firestore pagination using startAfter
const [lastVisible, setLastVisible] = useState(null);
const [listings, setListings] = useState([]);

const loadMore = async () => {
  let q = query(
    collection(db, 'listings'),
    where('isSold', '==', false),
    orderBy('createdAt', 'desc'),
    startAfter(lastVisible),
    limit(20)
  );
  
  const snapshot = await getDocs(q);
  const newListings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  setListings([...listings, ...newListings]);
  setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
};
```

---

## 20. Loading, Error, Empty States

### Redux Slice Pattern

```typescript
// Each slice has: data, isLoading, error
const listingsSlice = createSlice({
  name: 'listings',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setLoading(state) { state.isLoading = true; },
    setError(state, action) { state.error = action.payload; },
    setListings(state, action) {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});
```

### UI Components

```tsx
// Loading state
{isLoading && <LoadingSpinner />}

// Error state
{error && (
  <div className="bg-red-100 p-4 rounded">
    <p className="text-red-800">{error}</p>
    <button onClick={retry}>Spróbuj ponownie</button>
  </div>
)}

// Empty state
{!isLoading && items.length === 0 && (
  <div className="text-center py-12">
    <p className="text-gray-500">Brak produktów</p>
  </div>
)}

// Success state
{!isLoading && items.length > 0 && (
  <ProductGrid items={items} />
)}
```

---

## 21. Responsywność i dostępność

### Responsywność (Mobile-First)

```css
/* Tailwind breakpoints */
- Base: 320px (mobile)
- sm: 640px
- md: 768px (tablet)
- lg: 1024px
- xl: 1280px
```

**Key patterns:**
- Navbar: Hamburger (mobile) → Full nav (md:)
- Grid: 1 col (mobile) → 2 col (sm:) → 3 col (md:) → 4 col (lg:)
- Forms: 100% width (mobile) → max-w-md (md:)
- Gallery: 1 image (mobile) → 2 (sm:) → 3 (md:)

### Dostępność (WCAG 2.1 AA)

```tsx
// Semantic HTML
<button aria-label="Dodaj do ulubionych">
  <HeartIcon />
</button>

<form aria-label="Wyszukiwanie produktów">
  <label htmlFor="search">Szukaj</label>
  <input id="search" type="text" />
</form>

// Keyboard navigation
- Tab: Move through form fields
- Enter: Submit form
- Escape: Close modal

// Color contrast
- Text: minimum 4.5:1 (normal), 3:1 (large)
- Use color + icons (not just color to convey meaning)

// Images
<img alt="Produkt: Niebieska koszulka" src="..." />

// Focus states
button:focus { outline: 2px solid blue; }
```

---

## 22. Koszty Firebase — plan Blaze

### Firestore Pricing (Pay-as-you-go)

| Operacja | Koszt |
|----------|-------|
| Read | $0.06 per 100k |
| Write | $0.18 per 100k |
| Delete | $0.02 per 100k |
| Storage | $0.18 per GB/month |

### Cloud Storage Pricing

| Operacja | Koszt |
|----------|-------|
| Upload | $0.05 per GB |
| Download | $0.01-$0.23 per GB (depending on region) |
| Storage | $0.020 per GB/month |

### Plan Blaze — wymagany dla Cloud Storage

⚠️ **Firebase Spark (free)** — NIE ma Cloud Storage (tylko Firestore do 1GB)
✅ **Firebase Blaze (pay-as-you-go)** — Cloud Storage + Firestore unlimited

**Przybliżony koszt MVP (1000 aktywnych użytkowników):**
- Firestore reads: ~50k/miesiąc = $3
- Firestore writes: ~10k/miesiąc = $1.80
- Cloud Storage (100 GB zdjęć): $2/miesiąc
- **Total: ~$7/miesiąc** (przy normalnym użyciu)

---

## 23. Struktura danych — podsumowanie

### Collections w Firestore

```
/users/{userId}
  - email: string
  - name: string
  - avatar: string (URL)
  - bio: string
  - createdAt: Timestamp

/listings/{listingId}
  - userId: string (owner)
  - title: string (1-100 znaków)
  - description: string (1-5000 znaków)
  - price: number (> 0)
  - category: enum (fashion, electronics, home, sports, other)
  - condition: enum (new, like-new, good, fair)
  - size: string (optional, for fashion)
  - images: string[] (URLs, max 10)
  - isSold: boolean (default: false)
  - createdAt: Timestamp
  - updatedAt: Timestamp

/favorites/{userId}
  - listings: string[] (array of listing IDs)
  - updatedAt: Timestamp
```

---

## 24. Kryteria akceptacji MVP

### Must Have (Minimum Viable)

- [x] Rejestracja i logowanie
- [x] Profil użytkownika
- [x] Tworzenie/edytowanie/usuwanie ogłoszeń
- [x] Przeglądanie produktów (Home, Marketplace)
- [x] Szczegóły produktu
- [x] Wyszukiwanie i filtrowanie (prosta implementacja)
- [x] Ulubione
- [x] Responsywny interfejs (mobile + desktop)
- [x] Bezpieczeństwo (Security Rules, auth check)
- [x] Loading/error states

### Nice to Have (poza MVP)

- [ ] Rekomendacje
- [ ] Czat między użytkownikami
- [ ] Oceny/recenzje
- [ ] Admin panel
- [ ] Push notyfikacje
- [ ] Offline mode

### Testy MVP

- [x] Unit tests (Redux logic, utility functions)
- [x] Component tests (form validation, rendering)
- [x] E2E tests (user workflows: register → create listing → search)
- [x] Security tests (can't edit other's listings)

---

## 25. Decyzje techniczne — potwierdzenie

✅ **Zatwierdzone:**
1. Firebase Authentication + Firestore + Cloud Storage (bez tworzenia projektów jeszcze)
2. React Router v7 + Redux Toolkit + Tailwind CSS
3. React Hook Form + Zod (walidacja)
4. Vitest + React Testing Library + Playwright E2E
5. Dev/Prod Firebase projects (bez tworzenia)
6. Standardowe JWT Firebase (bez własnego)

---

## Zatwierdzenie

**Status:** ✅ ZAAKCEPTOWANE (z uwagami)

**Następny krok:** 
1. Przejść do **Figma Design System + 7 widoków** (desktop + mobile)
2. Wykorzystać Figma MCP + Skill frontend-design
3. Przedstawić do akceptacji
4. Po akceptacji → Implementation Plan (sprinty + GitHub Issues)

---

**Nie implementować jeszcze:**
- ❌ Kod React
- ❌ Instalacja bibliotek
- ❌ Podłączanie Firebase
- ❌ GitHub Issues
- ❌ Git commit/push/PR
