# Marketplace – Instrukcje projektu (Propozycja uproszczenia)

## 1. Przegląd projektu

**Marketplace** to aplikacja internetowa inspirowana Vinted, umożliwiająca użytkownikom kupowanie i sprzedawanie przedmiotów. 

Projekt rozwijany jest etapami, zgodnie z wymaganiami w `docs/requirements.md`. Celem jest stworzenie MVP, a następnie stopniowe rozszerzenie funkcjonalności.

---

## 2. Technologia

- **Aktualnie:** React, TypeScript, Vite, React Compiler
- **Zasada:** Wszystkie nowe biblioteki wymagają uzasadnienia
- **Baza:** Nie zmieniaj stosu bez zgody
- **Usługi:** Nie podłączaj Firebase ani innych serwisów bez wyraźnego pozwolenia

---

## 3. Architektura & Kod

- Komponenty funkcyjne React z custom hooks
- TypeScript (brak `any`)
- Logika biznesowa oddzielona od prezentacji
- Komponenty wielokrotnego użytku
- Czytelna struktura folderów

**Przed dużymi zmianami:** Przedstaw propozycję i czekaj na akceptację.

### Model danych – ustalenia obowiązujące we wszystkich sprintach

- **Kategorie:** `fashion` (Moda), `electronics` (Elektronika), `home` (Dom), `sports` (Sport), `other` (Inne) – źródło: `CATEGORIES` w `src/utils/constants.ts`
- **Podkategorie Mody:** `women` (Kobiety), `men` (Mężczyźni), `kids` (Dzieci) – źródło: `FASHION_SUBCATEGORIES`
  - Ogłoszenie z kategorii `fashion` **musi** mieć podkategorię; pozostałe kategorie jej **nie mają**
  - Reguła obowiązuje w danych mock, formularzach (Zod), filtrach i Firestore Security Rules
- **Dane użytkownika:** `PublicUser` (dane widoczne dla innych) jest oddzielony od `User` (dane prywatne, np. e-mail). Dane sprzedającego pokazywane innym użytkownikom przechodzą przez `toPublicUser()`
- Nie dodawaj kategorii/podkategorii w kodzie bez aktualizacji `docs/requirements.md`

---

## 4. UI/UX

- Responsywny design (mobile-first)
- Spójność wizualna i dostępność
- Semantyczny HTML, stany (loading, error, empty, success)
- **Bez kopiowania wyglądu Vinted** – własna tożsamość wizualna
- Korzystaj z `frontend-design` Skill

---

## 5. Bezpieczeństwo & Dane

- **Brak sekretów w kodzie** (.env, klucze API)
- Walidacja po stronie serwera
- Uprawnienia użytkownika
- Bez operacji destrukcyjnych bez zgody
- **Brak Firebase bez wyraźnego pozwolenia**

---

## 6. Workflow: Przed implementacją

1. Przeczytaj `CLAUDE.md` i `docs/requirements.md`
2. Przeanalizuj kod i GitHub Issues
3. Zaproponuj rozwiązanie
4. Przy większych zadaniach – przygotuj plan
5. Czekaj na akceptację

---

## 7. Workflow: Podczas implementacji

1. Tylko niezbędne zmiany
2. Przestrzegaj istniejącej architektury
3. Nie modyfikuj powiązanych komponentów
4. Kod łatwy do utrzymania
5. Korzystaj ze Skills i Subagents
6. **Brak nowych bibliotek bez uzasadnienia**

---

## 8. Workflow: Po implementacji

1. Sprawdź błędy TypeScript
2. Uruchom testy
3. Code Review
4. Podsumuj zmienione pliki
5. Zaproponuj commit message (Conventional Commits)
6. **Pozostaw zmiany niezatwierdzone** (bez git commit/push)

---

## 9. GitHub & Git

**Repozytorium:** `Michalopcd/marketplace-app`

### Przed implementacją
- Sprawdź istniejące Issues (`gh issue list`)
- Utwórz Issue jeśli nie istnieje
- Powiąż pracę z odpowiednim Issue

### Podczas pracy
- Pracuj na głównym Issue
- Wykonuj tylko wymagany zakres

### Ograniczenia (bezwzględne)
- ❌ `git commit` / `push` / `merge` / `rebase`
- ❌ Tworzenie Pull Requestów
- ❌ Operacje destrukcyjne na historii Git
- ✅ `git status` / `git diff`
- ✅ `gh issue` (list, view, create)

**GitHub Issues muszą zawierać:** tytuł (EN), opis (PL), wymagania, kryteria akceptacji, checklist, zależności.

---

## 10. Komunikacja

- **Odpowiedzi:** polski
- **Dokumentacja:** polski
- **Kod & Commits:** angielski
- Wyjaśniaj ważne decyzje techniczne
- Informuj o problemach i ograniczeniach

---

## 11. Testing & Debugging

### Playwright MCP
Testuj lokalne środowisko: nawigacja, formularze, walidacja, responsywność, komunikaty o błędach.

### Chrome DevTools MCP
Analizuj błędy JavaScript, komunikaty konsoli, żądania sieciowe, problemy wydajności.

**Zasada:** Nie testuj na produkcji, nie usuwaj danych.

---

## 12. Skills & Subagents

**Available Skills:**
- `frontend-design` – projektowanie interfejsów
- `react-typescript` – standardy React/TS
- `thermo-nuclear-code-quality-review` – szczegółowa analiza kodu

**Subagents:**
- `code-reviewer` – jakość kodu
- `tester` – testowanie
- `debugger` – diagnozowanie błędów

**Zasada:** Deleguj, gdy uzasadnione; unikaj zbędnych agentów.

**Thermo-Nuclear Code Quality Review:** Używaj do głębokiej analizy po:
- Ukończeniu większej funkcjonalności
- Rozbudowanej refaktoryzacji
- Przed wersją produkcyjną
- Na wyraźne polecenie

---

## 13. Figma (Design System)

Przed implementacją nowego widoku:
1. Przeanalizuj wymagania
2. Przygotuj mockupy (desktop + mobile)
3. Zaproponuj do akceptacji
4. Dopiero potem implementuj React

**Uwaga:** Figma MCP może być niedostępna – zaproponuj alternatywę.

---

## 14. Plan Mode & Verification

- Duże zadania = Plan Mode
- Weryfikuj pracę przed ukończeniem
- Code Review obowiązkowy
- Nie deklaruj sukcesu bez testów

---

## Podsumowanie najważniejszych zasad

✅ **Pozwolone:**
- TypeScript, custom hooks, komponenty wielokrotnego użytku
- Skills i Subagents
- GitHub Issues creation
- `git status`, `git diff`, `gh issue`

❌ **Zakazane:**
- `git commit`, `git push`, `git merge`, `git rebase`
- Nowe biblioteki bez uzasadnienia
- Firebase bez zgody
- Kopiowanie wyglądu Vinted
- Operacje destrukcyjne bez zgody
- Sekrety w kodzie

---

## Notatka o uproszczeniu

**Co zostało skrócone:**
- Sekcje 1–16 zkombinowane do 14 sekcji
- Powtórzenia usunięte
- Zasady bezpieczeństwa zachowane
- Wszystkie ograniczenia Git zachowane
- Automatyczne tworzenie GitHub Issues nadal aktywne

**Co zostało zachowane:**
- Wszelkie restrykcje bezpieczeństwa
- Wszystkie techniczne standardy
- Proces code review
- Workflow etapowy
- Komunikacja wielojęzykowa

