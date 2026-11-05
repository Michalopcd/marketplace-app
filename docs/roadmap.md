# NÓW Marketplace – Project Roadmap

## 📌 O Projekcie

**NÓW Marketplace** to webowa aplikacja e-commerce inspirowana Vinted, umożliwiająca użytkownikom kupowanie i sprzedawanie przedmiotów. Projekt jest rozwijany etapami, zaczynając od MVP (Minimum Viable Product) weryfikującego kluczowe funkcjonalności.

**Cel MVP:** Wdrażanie w ciągu ~7-8 tygodni z fokusem na authentication, listing management, search i favorites.

---

## ✨ MVP – Główne Funkcjonalności

### Dla wszystkich użytkowników
- ✅ Przeglądanie ogłoszeń na HOME i MARKETPLACE
- ✅ Wyszukiwanie produktów (po nazwie)
- ✅ Filtrowanie po kategorii, cenie, stanie
- ✅ Sortowanie (data, cena)
- ✅ Przeglądanie szczegółów produktu + galeria zdjęć

### Dla zalogowanych użytkowników
- ✅ Rejestracja i logowanie (email + hasło)
- ✅ Profil użytkownika (edycja danych, avatar)
- ✅ Tworzenie ogłoszeń (form, upload zdjęć, walidacja)
- ✅ Edycja i usuwanie własnych ogłoszeń
- ✅ Dodawanie do ulubionych (heart button)
- ✅ Przeglądanie listy ulubionych

### Cechy
- 📱 Responsywny design (mobile, tablet, desktop)
- 🔒 Bezpieczne zarządzanie uprawnieniami
- 🖼️ Optimizacja zdjęć (bez zniekształcania proporzcji)
- ⚠️ Obsługa błędów i stanów ładowania
- ♿ Dostępność WCAG 2.1 AA

---

## 🛠️ Technologia

| Layer | Technologia |
|-------|------------|
| **Frontend** | React 19.3 + TypeScript 6.0 |
| **Bundler** | Vite 8.3 |
| **Styling** | Tailwind CSS |
| **State** | Redux Toolkit |
| **Routing** | React Router v7 |
| **Auth** | Firebase Authentication (JWT) |
| **Database** | Firebase Firestore (NoSQL) |
| **Storage** | Firebase Cloud Storage (images) |
| **Forms** | React Hook Form + Zod |
| **Testing** | Vitest + RTL + Playwright |

---

## 📅 Sprint Roadmap (UI-First Approach)

| Sprint | Zakres | Podejście | Est. Czas |
|--------|--------|----------|-----------|
| **1** | Fundamenty, Design System, Header/Footer, HOME | Mock data | 1.5 tyg |
| **2** | MARKETPLACE, PRODUCT DETAILS, Search/Filter/Sort | Mock data | 1.5 tyg |
| **3** | LOGIN, REGISTER, Firebase Authentication | Firebase Auth | 1 tyg |
| **4** | Firestore, Cloud Storage, CRUD Listings | Firebase Backend | 1.5 tyg |
| **5** | PROFILE, FAVORITES, User Management, Real Data | Firebase Data | 1 tyg |
| **6** | Testing, Responsywność, Security, Optimization | Polish & QA | 1.5 tyg |

**Uwaga:** Harmonogram orientacyjny. Szczegółowe estymaty mogą się zmienić po rozpoczęciu pracy.

**Metodologia:** Najpierw budujemy interfejs na danych demonstracyjnych (mock), następnie integrujemy Firebase stopniowo w Sprint 3+.

---

## 📊 Harmonogram (Orientacyjny)

```
Tydzień 1-2:    Sprint 1 – Fundamenty + HOME
Tydzień 3-4:    Sprint 2 – MARKETPLACE + Product Details
Tydzień 5:      Sprint 3 – Authentication
Tydzień 6-7:    Sprint 4 – Firestore + CRUD
Tydzień 8:      Sprint 5 – Profile + Favorites
Tydzień 9:      Sprint 6 – Testing + Polish

─────────────────────────────────────────────
Total: ~7-8 tygodni (48-56 dni pracy)
```

---

## 📬 Post-MVP: MESSAGES (Przyszłe)

Moduł **chat między użytkownikami** zaplanowany jako **osobny etap po MVP**, wymagający eksplicytnej decyzji.

### Scope (Preliminary)
- Prywatne rozmowy kupujący ↔ sprzedający
- Historia konwersacji
- Notyfikacje o nowych wiadomościach
- Real-time updates

**Status:** Oczekuje na zatwierdzenie (nie część MVP).

---

## ✅ Kryteria Ukończenia MVP

### Funkcjonalność
- [ ] Wszyscy użytkownicy mogą przeglądać produkty
- [ ] Rejestracja i logowanie działają
- [ ] Zalogowani użytkownicy mogą tworzyć ogłoszenia
- [ ] Wyszukiwanie i filtrowanie działają
- [ ] System ulubionych działa
- [ ] Profil użytkownika zapamiętuje dane

### Jakość & Performance
- [ ] Responsywny design (375px, 768px, 1440px)
- [ ] Accessibility WCAG 2.1 AA
- [ ] Unit tests >80% coverage (critical code)
- [ ] E2E testy dla głównych flow'ów
- [ ] Lighthouse scores >90 (Performance, Accessibility, Best Practices)
- [ ] Brak console errors

### Security
- [ ] Firebase Security Rules wdrożone
- [ ] Cloud Storage Security Rules wdrożone
- [ ] Brak sekretów w kodzie
- [ ] Tokeny zarządzane bezpiecznie
- [ ] Uprawnienia do edycji/usuwania weryfikowane

### Deployment
- [ ] Build bez błędów: `npm run build`
- [ ] Bundle size <200KB (gzipped)
- [ ] Dokumentacja kompletna
- [ ] GitHub Issues zamknięte (Sprint 1-6)

---

## 📚 Dokumentacja

- **[Full Implementation Plan](./implementation-plan.md)** – Szczegółowy plan z opisem każdego sprintu
- **[Setup Guide](./SETUP.md)** – Jak zainstalować i uruchomić projekt (będzie dostępny)
- **[Architecture](./ARCHITECTURE.md)** – Redux, Firestore, API patterns (będzie dostępny)
- **[Security](./SECURITY.md)** – Firestore Rules, auth flow (będzie dostępny)

---

## 🚀 Jak Zacząć

1. Czytaj [Full Implementation Plan](./implementation-plan.md) – zawiera wszystkie szczegóły
2. Śledź Sprint 1 GitHub Issues (będą utworzone)
3. Komunikuj ewentualne blokery lub pytania
4. Po MVP – decyzja o MESSAGES module

---

**Status:** 🟨 Roadmap zatwierdzony, przygotowany do wdrożenia.

*Ostatnia aktualizacja: 2026-11-15*
