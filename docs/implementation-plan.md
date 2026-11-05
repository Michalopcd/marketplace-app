# NÓW Marketplace – Plan Implementacji MVP

**Data:** 2026-11-15  
**Projekt:** Aplikacja e-commerce inspirowana Vinted  
**Technologia:** React 19.3 + TypeScript 6.0 + Vite 8.3 + Redux Toolkit + React Router v7 + Firebase  
**Podejście:** UI-First (dane mock Sprint 1-2) → Integracja Firebase (Sprint 3-5) → Polishing & Testowanie (Sprint 6)  
**Harmonogram:** ~7-8 tygodni (6 sprintów)

---

## Cel i Zakres

Budowa MVP Marketplace skupiająca się na:
- Przeglądaniu i wyszukiwaniu produktów
- Rejestracji i zarządzaniu profilem
- Tworzeniu ogłoszeń ze zdjęciami
- Systemie ulubionych
- Responsywnym interfejsie (mobile-first)

**Po MVP (przyszłe funkcjonalności):** wiadomości, płatności, oceny i recenzje, panel administratora.

---

## Funkcjonalności MVP

### Wszyscy użytkownicy
- ✅ Przeglądanie stron HOME i MARKETPLACE
- ✅ Wyszukiwanie, filtrowanie, sortowanie
- ✅ Przeglądanie szczegółów produktu i galerii
- ✅ Responsywny design (375px, 768px, 1440px)

### Zalogowani użytkownicy
- ✅ Rejestracja i logowanie (email i hasło)
- ✅ Profil z edycją danych i awatarem
- ✅ Tworzenie, edycja, usuwanie ogłoszeń
- ✅ Upload zdjęć z optymalizacją (bez zniekształcania proporcji)
- ✅ Dodawanie produktów do ulubionych
- ✅ Przeglądanie listy ulubionych produktów

### Cechy Cross-cutting
- ✅ Obsługa błędów i stanów ładowania
- ✅ Dostępność WCAG 2.1 AA
- ✅ Firestore Security Rules
- ✅ Bezpieczeństwo Cloud Storage

---

## Technologia – Kluczowe Decyzje

| Aspekt | Wybór | Uzasadnienie |
|--------|-------|-------------|
| Frontend | React 19.3 + TypeScript | Standardy, bezpieczeństwo typów |
| Styling | Tailwind CSS | Podejście mobile-first, szybka iteracja |
| State | Redux Toolkit | Przewidywalny, skalowalny |
| Routing | React Router v7 | Standard branży, stabilny |
| Forms | React Hook Form + Zod | Lekkie, bezpieczne typami |
| Auth | Firebase JWT | Zintegrowany, bezpieczny |
| Database | Firebase Firestore | NoSQL, real-time, serverless |
| Storage | Firebase Cloud Storage | Zdjęcia i awatary użytkowników |
| Testing | Vitest + RTL + Playwright | Testy jednostkowe, komponentów, E2E |

---

## Struktura Aplikacji

### Struktura Katalogów
```
src/
├── pages/          # 7 stron (Home, Marketplace, ProductDetails, Auth, Profile, CreateListing, Favorites)
├── components/     # Komponenty wielokrotnego użytku (Navigation, ProductCard, ProductGrid, SearchBar, Filters, AuthForm, itd.)
├── redux/          # 5 slice'ów (auth, listings, user, favorites, search)
├── services/       # Integracja Firebase (auth, listings, users, favorites, storage, images)
├── hooks/          # Custom hooks (useAuth, useListings, useFavorites)
├── types/          # Interfejsy TypeScript
├── utils/          # Funkcje pomocnicze (walidacja, formatowanie, stałe)
├── data/           # mockData.ts (Sprint 1-2)
└── styles/         # Globalne style Tailwind
```

### Redux Store (5 Slice'ów)
- **auth:** { user, isLoading, error }
- **listings:** { items[], current, filters, isLoading, error }
- **user:** { profile, myListings[], isLoading }
- **favorites:** { items[] (identyfikatory), isLoading }
- **search:** { query, filters } (wyniki obliczane z listings.items)

### Kolekcje Firestore
```
/users/{userId}         → email, imię, awatar, biografia, createdAt, updatedAt
/listings/{listingId}   → userId, tytuł, opis, cena, kategoria, stan, zdjęcia[], sprzedane, createdAt, updatedAt
/favorites/{userId}     → listings[] (tablica identyfikatorów), updatedAt
```

---

## Sprint Roadmap

| Sprint | Zakres | Podejście | Estymacja |
|--------|--------|----------|----------|
| **1** | Fundamenty, Design System, HOME | Dane mock | 1,5 tygodnia |
| **2** | MARKETPLACE, PRODUCT DETAILS, Search/Filter/Sort | Dane mock | 1,5 tygodnia |
| **3** | LOGIN, REGISTER, Firebase Auth, Protected Routes | Firebase Auth | 1 tydzień |
| **4** | Firestore, Cloud Storage, CRUD Listings, Image Upload | Firebase Backend | 1,5 tygodnia |
| **5** | PROFILE, FAVORITES, User Management, Real Data | Firebase Data | 1 tydzień |
| **6** | Testing, Responsywność, Security, Optimization, Docs | Polishing & QA | 1 tydzień |

---

## Sprint Details

### Sprint 1: Fundamenty + Design System + HOME (1,5 tygodnia)

**Cel:** Aplikacja posiada wizualną podstawę, Design System, nawigację i stronę HOME z produktami z danych mock.

**Główne Zadania:**
1. Konfiguracja Redux store (5 slice'ów) + React Router (11 tras)
2. Dane mock (20+ produktów, 5 użytkowników, kategorie)
3. Globalne style Tailwind CSS + komponenty Design System
4. Navigation i Footer (responsywne, menu hamburger na urządzeniach mobilnych)
5. Strona HOME (hero, polecane produkty, kategorie)
6. Komponenty ProductCard i ProductGrid
7. Testy jednostkowe (Redux) + testowanie responsywności (375px, 1440px)

**Zależności:** Brak

**Kryteria Akceptacji:**
- Strona HOME wyświetla polecane produkty z danych mock
- Navigation responsywna (menu hamburger na mobilnych)
- Brak błędów w konsoli
- Testy jednostkowe >80% pokrycia dla Redux
- Responsywny design na 375px, 768px, 1440px

**Testowanie:**
- Testy jednostkowe: Redux slices (listings)
- Testy komponentów: ProductCard, ProductGrid, Navigation
- Responsywność: mobilne, tablet, desktop
- Dostępność: etykiety ARIA, semantyczny HTML

---

### Sprint 2: MARKETPLACE + PRODUCT DETAILS + Search/Filter/Sort (1,5 tygodnia)

**Cel:** Kompletna strona MARKETPLACE z wyszukiwaniem, filtrowaniem, sortowaniem i widokiem szczegółów produktu.

**Główne Zadania:**
1. Strona MARKETPLACE + komponent SearchBar
2. Komponent Filters (kategoria, cena, stan) + Sorting (data, cena)
3. Logika filtrowania po stronie klienta (dane mock)
4. Strona PRODUCT DETAILS + komponent Gallery (carousel, miniatury)
5. Paginacja (załaduj więcej, 20 produktów na stronę)
6. Testy jednostkowe i E2E

**Zależności:** Sprint 1

**Kryteria Akceptacji:**
- Strona MARKETPLACE wyświetla wszystkie produkty
- Wyszukiwanie, filtr kategorii, zakres ceny, filtr stanu działają
- Sortowanie (data, cena rosnąco/malejąco) działa
- Kliknięcie na produkt → PRODUCT DETAILS
- Galeria z miniaturami (responsywna)
- Paginacja działa

**Testowanie:**
- Testy jednostkowe: logika filtrowania, funkcje sortowania
- Testy komponentów: SearchBar, Filters, Gallery
- E2E: Search → Filter → Sort → View product
- Responsywność: filtry na mobilnych (drawer), desktop (sidebar)

---

### Sprint 3: LOGIN + REGISTER + Firebase Auth (1 tydzień)

**Cel:** Użytkownik może się rejestrować i logować. Chronione trasy działają. Stan autentykacji jest zachowywany.

**Główne Zadania:**
1. Konfiguracja Firebase Auth (email/password)
2. authService (register, login, logout, getCurrentUser)
3. Strony Login i Register + komponent AuthForm
4. Redux authSlice + async thunks
5. Utrzymywanie stanu autentykacji (onAuthStateChanged)
6. Komponent ProtectedRoute
7. Aktualizacja Navigation (pokaż opcje logowania/wylogowania na podstawie stanu auth)
8. Testy E2E (przepływy rejestracji, logowania, wylogowania)

**Zależności:** Sprint 1-2

**Kryteria Akceptacji:**
- Użytkownik może się rejestrować za pomocą email i hasła
- Użytkownik może się logować
- Stan autentykacji jest zachowywany po przeładowaniu strony
- Chronione trasy przekierowują do /login, jeśli użytkownik nie jest zalogowany
- Navigation wyświetla opcje logowania/wylogowania
- Testy E2E zdane

**Testowanie:**
- Testy jednostkowe: Auth service, schematy walidacji (Zod)
- Testy komponentów: AuthForm, ProtectedRoute
- E2E: Register → Login → Logout, Protected route access
- Bezpieczeństwo: HTTPS (w produkcji), bezpieczne przechowywanie tokenów

---

### Sprint 4: Firestore + Cloud Storage + CRUD Listings (1,5 tygodnia)

**Cel:** Zalogowany użytkownik może tworzyć, edytować i usuwać ogłoszenia. Zdjęcia są optymalizowane i przechowywane.

**Główne Zadania:**
1. Konfiguracja Firestore + Security Rules
2. Bucket Cloud Storage + Security Rules
3. imageService (zmiana rozmiaru 1200x900, miniatura 400x300, bez zniekształcania)
4. storageService (upload do Cloud Storage)
5. listingsService (createListing, updateListing, deleteListing, getListing, getUserListings)
6. Komponent ListingForm (tytuł, opis, cena, kategoria, stan, rozmiar, zdjęcia)
7. Komponent ImageUpload (multi-select, podgląd, drag-drop)
8. Strony CreateListing i EditListing
9. userService (utworzenie dokumentu /users przy pierwszym logowaniu, updateProfile, uploadAvatar)
10. Testy jednostkowe, E2E i testowanie bezpieczeństwa (użytkownik nie może edytować/usuwać cudzych ogłoszeń)

**Zależności:** Sprint 3

**Kryteria Akceptacji:**
- Użytkownik może tworzyć ogłoszenie z 1-10 zdjęciami
- Zdjęcia zoptymalizowane (1200x900 główne, 400x300 miniatury)
- Użytkownik może edytować własne ogłoszenie
- Użytkownik może usunąć własne ogłoszenie (i jego zdjęcia)
- Użytkownik NIE może edytować/usuwać cudzych ogłoszeń (403 z Firestore)
- Dane użytkownika utworzone w kolekcji /users
- Firestore Security Rules wymuszane
- Cloud Storage Security Rules wymuszane

**Testowanie:**
- Testy jednostkowe: logika zmiany rozmiaru zdjęć, walidacja formularzy (Zod)
- Testy komponentów: ListingForm, ImageUpload
- E2E: Create listing → Upload images → Save → Verify in Firestore
- Bezpieczeństwo: kontrola uprawnień (użytkownik nie może modyfikować cudzych ogłoszeń)

---

### Sprint 5: PROFILE + FAVORITES + Real Data (1 tydzień)

**Cel:** Użytkownik ma pełny profil, może zarządzać ulubionymi. Dane rzeczywiste pobierane z Firestore.

**Główne Zadania:**
1. Strona PROFILE (informacje użytkownika, moje ogłoszenia, edycja profilu)
2. Strona EditProfile (imię, biografia, upload awatara)
3. favoritesService (addFavorite, removeFavorite, getFavorites)
4. favoritesSlice (Redux)
5. Przycisk Favorite na ProductCard (przełącz, ikona ❤️)
6. Strona FAVORITES (lista ulubionych produktów)
7. Listenery real-time (subscribeToListings, subscribeToUserListings)
8. Integracja danych rzeczywistych (HOME, MARKETPLACE, PRODUCT DETAILS)
9. Wyszukiwanie/filtrowanie na danych rzeczywistych (MVP po stronie klienta)
10. Testy jednostkowe i E2E

**Zależności:** Sprint 4

**Kryteria Akceptacji:**
- Strona PROFILE wyświetla informacje użytkownika i moje ogłoszenia
- Użytkownik może edytować profil (imię, biografia, awatar)
- Upload awatara do Cloud Storage
- Użytkownik może dodawać/usuwać z ulubionych
- Strona FAVORITES wyświetla ulubione ogłoszenia
- Dane rzeczywiste z Firestore na HOME, MARKETPLACE
- Wyszukiwanie/filtrowanie działają na danych rzeczywistych
- Aktualizacje real-time działają

**Testowanie:**
- Testy jednostkowe: Favorites service, Redux slices
- Testy komponentów: Profile, Favorites, Favorite button
- E2E: Edit profile → Add to favorites → View favorites → Remove
- Integracja: Firestore listeners, aktualizacje real-time

---

### Sprint 6: Testing + Responsywność + Security + Optimization (1 tydzień)

**Cel:** MVP jest responsywny, testowany, bezpieczny i gotowy do publikacji.

**Główne Zadania:**
1. **Audit responsywności:** Wszystkie strony na 375px, 768px, 1440px
   - Naprawa problemów responsywności (siatki, formularze, modale, menu hamburger)
2. **Dostępność (WCAG 2.1 AA):** Semantyczny HTML, etykiety ARIA, nawigacja klawiaturą, kontrast kolorów
3. **Obsługa błędów:** Global Error Boundary, powiadomienia Toast, stany puste/błędu
4. **Wydajność:** Leniwistyczne ładowanie zdjęć, rozmiar bundla <200KB (skompresowany), Lighthouse >90
5. **Weryfikacja bezpieczeństwa:** testowanie Firestore Rules, testowanie Cloud Storage Rules, brak sekretów w kodzie
6. **Suita testów:**
   - Testy jednostkowe: >80% pokrycia (Redux, utils, walidacja)
   - Testy komponentów: wszystkie główne komponenty
   - Testy E2E: 4 główne przepływy użytkownika (przeglądanie, rejestracja, tworzenie ogłoszenia, ulubione)
7. **Dokumentacja:** README, SETUP, ARCHITECTURE, SECURITY docs
8. **Ostateczna kontrola jakości:** kompatybilność przeglądarek, weryfikacja buildu, brak błędów w konsoli

**Zależności:** Sprint 1-5 kompletny

**Kryteria Akceptacji:**
- Wszystkie strony responsywne (375px, 768px, 1440px)
- Kompatybilne z WCAG 2.1 AA (semantyczny HTML, ARIA, nawigacja klawiaturą, kontrast kolorów)
- Error Boundary przechwytuje błędy React
- Stany ładowania + puste stany + stany błędu działają
- Wyniki Lighthouse >90 (Performance, Accessibility, Best Practices)
- Rozmiar bundla <200KB (skompresowany)
- Testy jednostkowe >80% pokrycia
- Testy E2E zdane (4 główne przepływy)
- Firestore/Cloud Storage Security Rules zweryfikowane
- Brak błędów lub ostrzeżeń w konsoli
- Build pomyślny: `npm run build`
- Dokumentacja kompletna

**Testowanie:**
- Testy jednostkowe: >80% pokrycia (Redux, utils, walidacja)
- Testy komponentów: wszystkie główne komponenty (Vitest + RTL)
- E2E: 4 przepływy użytkownika (Playwright)
- Dostępność: audit WCAG 2.1 AA
- Wydajność: Lighthouse, rozmiar bundla, optymalizacja zdjęć
- Bezpieczeństwo: Firestore Rules, Cloud Storage Rules, brak zakodowanych sekretów
- Responsywność: 3 punkty przerwania, wszystkie strony, docelowe pola dotykowe >44x44px

---

## Strategia Testów

**Testy Jednostkowe (Vitest + RTL):**
- Redux slices (auth, listings, user, favorites, search): >80% pokrycia
- Schematy walidacji (Zod): wszystkie reguły walidacji
- Funkcje pomocnicze (formatowanie, filtrowanie): wszystkie przypadki

**Testy Komponentów (Vitest + React Testing Library):**
- Wszystkie komponenty stron: renderowanie, interakcje użytkownika
- Komponenty wspólne: ProductCard, ProductGrid, SearchBar, Filters, itd.
- Formularze: AuthForm, ListingForm, sprzężenie zwrotne walidacji

**Testy E2E (Playwright):**
1. Przepływ przeglądania: HOME → MARKETPLACE → Filter → PRODUCT DETAILS
2. Przepływ rejestracji: REGISTER → Validation → Redirect → Profile
3. Przepływ tworzenia ogłoszenia: LOGIN → CREATE LISTING → Upload images → Save → Verify in MARKETPLACE
4. Przepływ ulubionych: LOGIN → ADD to favorites → FAVORITES → REMOVE

**Testowanie Responsywności:**
- Urządzenia mobilne: 375px, 390px
- Tablety: 640px, 768px
- Desktop: 1024px, 1440px
- Docelowe pola dotykowe: >44x44px
- Menu hamburger: tylko na urządzeniach mobilnych

**Dostępność (WCAG 2.1 AA):**
- Semantyczny HTML: właściwa hierarchia nagłówków, punkty orientacyjne
- Etykiety ARIA: przyciski, pola formularza, regiony
- Nawigacja klawiaturą: Tab przez wszystkie elementy interaktywne
- Kontrast kolorów: 4.5:1 (normalny), 3:1 (duży tekst)
- Zdjęcia: opisowy tekst alternatywny

---

## Bezpieczeństwo

### Firestore Security Rules (Zweryfikowane)
```
/users:     czytanie dla wszystkich, pisanie tylko własne
/listings:  czytanie dla wszystkich, tworzenie własne (jeśli uwierzytelniony), aktualizacja/usuwanie tylko własne
/favorites: czytanie/pisanie tylko własne
```

Walidacja na serwerze (Firestore Rules):
- Tytuł: 1-100 znaków
- Opis: 10-5000 znaków
- Cena: > 0
- Kategoria, stan, zdjęcia zwalidowane

### Bezpieczeństwo Cloud Storage
- Pisanie tylko do własnego folderu: `/users/{userId}/...`
- Rozmiar pliku: <5 MB
- Formaty: JPEG, PNG, WebP
- Publiczne czytanie (zdjęcia są publiczne)

### Zarządzanie Tokenami JWT Firebase
- Firebase SDK zarządza tokenami automatycznie
- Nie jest wymagane ręczne obsługiwanie tokenów
- Tokeny przechowywane w localStorage (domyślnie Firebase)
- Automatyczne odświeżanie przed wygaśnięciem
- Wylogowanie czyści token

### Zapobieganie XSS i CSRF
- React maskuje tekst domyślnie
- Walidacja danych wejściowych (schematy Zod)
- Firestore Rules walidują po stronie serwera
- Brak zakodowanych sekretów w kodzie (.env.local)

---

## GitHub Issues – Organizacja Pracy

Każdy sprint podzielony na 4-6 GitHub Issues (karty zadań):

**Szablon:**
```
Tytuł: [Sprint N.M] [Typ] Nazwa funkcjonalności/zadania

Opis (PL)
- Wymagania: [ ]
- Kryteria akceptacji: [ ]
- Zależności: Issue #X, Issue #Y
- Estymacja: 3-5-8 punktów (1-4 dni)
- Etykiety: sprint-N, type-feature, priority-high
```

**Sprint 1 Issues (Przykład):**
- Sprint 1.1: Setup + Mock Data (2 dni)
- Sprint 1.2: Design System Components (2 dni)
- Sprint 1.3: Navigation & Footer (1,5 dnia)
- Sprint 1.4: HOME Page (2 dni)
- Sprint 1.5: Unit Tests & Responsive (1,5 dnia)

Każde Issue zawiera: plan testów, kryteria akceptacji, zależności.

---

## Dodatkowe Ustalenia

**Biblioteki (Sprint 1):**
```bash
npm install redux @reduxjs/toolkit react-redux react-router-dom@7 react-hook-form zod firebase tailwindcss -D vitest @testing-library/react @playwright/test
```

**Zmienne Środowiska (.env.local):**
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
# itd.
```

**Ograniczenia Git (CLAUDE.md):**
- ❌ NIE: git commit, push, merge, rebase
- ❌ NIE: gh pr create (tylko manualnie)
- ✅ TAK: git status, git diff, gh issue create

**Harmonogram Orientacyjny:**
```
Tydzień 1-2:  Sprint 1 (8-9 dni)
Tydzień 3-4:  Sprint 2 (7-8 dni)
Tydzień 5:    Sprint 3 (6-7 dni)
Tydzień 6-7:  Sprint 4 (10-12 dni)
Tydzień 8:    Sprint 5 (7-8 dni)
Tydzień 9:    Sprint 6 (9-10 dni)
```

---

## Status i Następne Kroki

**Status:** ✅ Plan zatwierdzony, gotowy do implementacji

**Następnie:**
1. Zatwierdzenie tego planu
2. Utworzenie GitHub Issues dla Sprint 1
3. Kodowanie Sprint 1
4. Cotygodniowe przeglądy między sprintami
5. Sprint 6: ostateczna kontrola jakości i gotowość wydania

---

**Dokument:** Skrócona wersja (pełne szczegóły w Design Doc)  
*Ostatnia aktualizacja: 2026-11-15*
