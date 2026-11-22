# Audyt Sprintu 1 – testy, responsywność i dostępność

**Issue:** #5 · Sprint 1.5 – Unit Tests & Responsive Design
**Zakres:** widoki Sprintu 1, czyli strona główna (`/`), strona 404, nagłówek z menu mobilnym i stopka
**Narzędzia:** Vitest + React Testing Library, `@vitest/coverage-v8`, przeglądarka (pomiar wymiarów elementów i obcinania fokusu, Tab z klawiatury, konsola)

## 1. Pokrycie testami

| Metryka | `src/redux` (wymóg > 80%) | Cały projekt |
|---|---|---|
| Lines | **100%** (35/35) | 98,3% |
| Statements | **100%** (40/40) | 85,7% |
| Functions | **100%** (19/19) | 97,8% |
| Branches | **100%** (4/4) | 71,5% |

- Próg 80% dla `src/redux/**` jest ustawiony w `vite.config.ts` (`test.coverage.thresholds`), a `npm run test:coverage` kończy się kodem 0.
- Liczba testów: **149** w 19 plikach (wcześniej 145).
- Nowe testy pokrywają dwie dotąd nieprzetestowane ścieżki:
  - menu mobilne zamyka się po poszerzeniu okna do układu desktop (i zostaje otwarte, jeśli okno pozostaje wąskie),
  - strona błędu `RouteError`: pokazuje kod dla błędu odpowiedzi 404 i nie pokazuje kodu dla zwykłego wyjątku.

Testy wymienione w Issue (ProductCard, ProductGrid, Navigation, Footer, Home) istniały już wcześniej i ich nie powielam.

## 2. Responsywność

Pomiary w przeglądarce na szerokościach **320, 375, 768, 1024 i 1440 px**.

| Kryterium | Wynik |
|---|---|
| Poziomy scroll strony | brak na wszystkich szerokościach |
| Nachodzenie elementów w nagłówku | brak; wszystkie elementy mieszczą się w pasku |
| Rząd kategorii (od 768 px) | jedna linia, 44 px wysokości |
| Siatka „Świeżo dodane” | 2 kolumny (telefon i tablet), 4 (desktop) |
| Karty kategorii | przewijany rząd poniżej 1024 px, siatka 7 kolumn od 1024 px |

**Powiększenie (zoom i rozmiar tekstu):**
- **Powiększenie strony (Ctrl +)** skaluje cały układ, więc daje te same układy co powyższe szerokości. Bez problemów.
- **Powiększony rozmiar tekstu** (125, 150 i 200% domyślnej czcionki):
  - **768 i 1440 px:** brak poziomego scrolla. Rząd kategorii na 768 px przechodzi do drugiej linii zamiast wychodzić poza ekran, a nagłówek rozciąga się w pionie.
  - **375 px:** nagłówek jest poprawny przy każdym powiększeniu. Przy **200%** tekstu poziomy scroll powodują jednak treści strony głównej: kolumna tekstu w hero, link „Zobacz wszystkie” i tytuły kart produktów. Zob. sekcję 5.

## 3. Dostępność

| Kryterium | Wynik |
|---|---|
| Pola dotykowe ≥ 44×44 px | ✅ wszystkie interaktywne elementy, mierzone rzeczywistym rozmiarem, a nie klasami. Tytuł karty produktu ma link rozciągnięty na całą kartę. |
| Widoczny fokus | ✅ obrys widoczny ze wszystkich stron, także w rzędzie kategorii. W kartach kategorii fokus jest ramką wewnątrz zdjęcia. |
| Landmarki i nagłówki | ✅ `header`, `main`, `footer`, nazwane `nav`; jeden `<h1>` na stronę; sekcje strony głównej opisane nagłówkami `h2` |
| Skip link | ✅ pierwszy element fokusowalny, prowadzi do `#main-content` |
| Menu mobilne | ✅ natywny `<dialog>`: pułapka fokusu, Escape, powrót fokusu, `aria-expanded`, `aria-controls`; zamyka się po poszerzeniu okna |
| Aktywny link | ✅ `aria-current="page"` według ścieżki i filtrów kategorii |
| Kontrast | ✅ tokeny tekstowe ≥ 4,5:1 (sprawdzone w Issue #2–#4) |
| Konsola przeglądarki | ✅ brak błędów i ostrzeżeń (tylko wpisy `debug`/`info` Vite i React DevTools) |

Lighthouse (Chrome DevTools MCP) nie był dostępny w tej sesji, więc audyt dostępności wykonałem pomiarami w przeglądarce i testami.

## 4. Wprowadzone poprawki

| # | Problem | Poprawka | Plik |
|---|---|---|---|
| R1 | Rząd kategorii: linki miały 42 px wysokości, a `overflow-x-auto` obcinał górę i dół obrysu fokusu | Usunięte przewijanie; rząd i linki mają 44 px; przy powiększonym tekście rząd przechodzi do drugiej linii. Krótkie etykiety mają pole ≥ 44 px dzięki `px`/`-mx` bez przesuwania układu. Podkreślenie pozostaje pod tekstem. | `SiteHeader.tsx` |
| R2 | Stopka: krótkie linki („Dom”, „Inne”) miały 25–39 px szerokości | `min-w-11`; zmierzone minimum to 44×44 px | `SiteFooter.tsx` |
| R3 | Nagłówek: stała wysokość i ujemne marginesy w `rem` przy powiększonym tekście wychodziły poza pasek i ekran | `min-h-` zamiast `h-`; marginesy krawędzi w px | `SiteHeader.tsx`, `MobileMenu.tsx` |
| R4 | Karty kategorii: ujemny margines w `rem` przy powiększonym tekście powodował poziomy scroll strony | Margines w px, zgodny z marginesami bocznymi `Container` (16/32 px) | `CategoryShowcase.tsx` |

Przy domyślnym rozmiarze tekstu wygląd się nie zmienia. Jedyna różnica to rząd kategorii wyższy o 2 px (42 → 44 px).

## 5. Uwagi poza zakresem (rekomendacje)

1. **Powiększony tekst do 200% na telefonie (375 px):** poziomy scroll powodują kolumna tekstu w hero, link „Zobacz wszystkie” (`shrink-0`) i tytuły kart produktów. Kryteria Issue #5 (domyślny tekst, 375/768/1440 px) są spełnione. Rekomenduję poprawki przy audycie WCAG w Sprincie 6:
   - zawijanie linku sekcji,
   - `min-w-0`/`break-words` w hero.
2. **`NotFound` i `RouteError`** używają kolorów `neutral-*` zamiast tokenów projektu i nie mają kroju display. Kontrast jest poprawny, więc to kwestia spójności wizualnej.
3. **`MobileMenu`:** funkcja `close` jest używana w efekcie bez wpisu w zależnościach (działa, bo korzysta tylko z refa). Klasy `motion-reduce:` dublują globalną regułę z `globals.css`.

## 6. Wyniki weryfikacji

| Polecenie | Wynik |
|---|---|
| `npm test` | 149/149 testów, 19 plików |
| `npm run test:coverage` | kod 0, próg `src/redux` spełniony (100%) |
| `npm run lint` | bez błędów i ostrzeżeń |
| `npx tsc -b` | bez błędów |
| `npm run build` | przechodzi (JS 122,8 kB gzip) |
| Code review (niezależny subagent) | zatwierdzone z uwagami; bez uwag krytycznych i ważnych. Wprowadzone drobne poprawki: test sprawdza właściwe media query, raport tekstowy pokrycia pokazuje też pliki ze 100%. |
