
# Marketplace – Instrukcje projektu

## 1. Opis projektu

Marketplace to aplikacja internetowa umożliwiająca
użytkownikom sprzedaż i kupowanie przedmiotów.

Projekt ma być rozwijany etapami, zgodnie z
wymaganiami zapisanymi w docs/requirements.md.

## 2. Technologie

Aktualnie:
- React
- TypeScript
- Vite

Pozostałe technologie należy ustalić przed
rozpoczęciem ich implementacji.

Nie dodawaj nowych bibliotek bez uzasadnienia.

## 3. Architektura

- Stosuj komponenty funkcyjne React.
- Wykorzystuj custom hooks do logiki wielokrotnego użytku.
- Oddzielaj logikę biznesową od prezentacji.
- Twórz komponenty możliwe do ponownego użycia.
- Zachowuj czytelną strukturę folderów.
- Unikaj duplikowania kodu.

## 4. Standardy kodowania

- Używaj TypeScript.
- Unikaj typu any.
- Stosuj czytelne nazwy zmiennych i funkcji.
- Nie modyfikuj bezpośrednio stanu React.
- Obsługuj błędy operacji asynchronicznych.
- Przestrzegaj zasad React Hooks.
- Nie dodawaj niepotrzebnych optymalizacji.
- Usuwaj nieużywany kod.

## 5. Projektowanie interfejsu

- Stosuj responsywny design.
- Zachowuj spójność wizualną aplikacji.
- Dbaj o dostępność (accessibility).
- Stosuj semantyczny HTML.
- Uwzględniaj stany loading, error i empty.
- Korzystaj z istniejących komponentów.

## 6. Bezpieczeństwo

- Nie ujawniaj sekretów ani kluczy prywatnych.
- Nie dodawaj plików .env z sekretami do Git.
- Sprawdzaj uprawnienia użytkownika.
- Nie ufaj wyłącznie walidacji frontendowej.
- Nie wykonuj operacji destrukcyjnych bez zgody.
- Nie wysyłaj zmian na GitHub bez zgody.

## 7. Praca nad funkcjonalnościami

Przed implementacją:
1. Przeczytaj odpowiednie wymagania.
2. Przeanalizuj istniejący kod.
3. Zaproponuj rozwiązanie.
4. Przy większych zadaniach przygotuj plan.
5. Jeśli decyzja architektoniczna jest niejasna,
   przedstaw dostępne możliwości.

Podczas implementacji:
1. Wprowadzaj tylko potrzebne zmiany.
2. Przestrzegaj istniejącej architektury.
3. Nie zmieniaj niezwiązanych komponentów.
4. Pisz czytelny i łatwy do utrzymania kod.

Po implementacji:
1. Sprawdź błędy TypeScript.
2. Uruchom dostępne kontrole jakości.
3. Podsumuj zmodyfikowane pliki.
4. Zgłoś ewentualne problemy.

## 8. Komunikacja

- Odpowiadaj użytkownikowi po polsku.
- Nazwy zmiennych, funkcji i komponentów pisz
  po angielsku.
- Wyjaśniaj ważniejsze decyzje techniczne.
- Nie wprowadzaj dużych zmian bez ustalenia planu.



## 9. GitHub – Issues i kontrola wersji

### Tworzenie Issues

- Przed rozpoczęciem nowej funkcjonalności sprawdź,
  czy istnieje już odpowiednie Issue na GitHubie.
- Jeśli Issue nie istnieje, utwórz nowe automatycznie.
- Nie twórz duplikatów.
- Każde Issue powinno zawierać:
  - Tytuł zadania.
  - Opis funkcjonalności.
  - Wymagania techniczne.
  - Kryteria akceptacji.
  - Listę zadań do wykonania.
- Opisy Issues przygotowuj po polsku.
- Jedno Issue powinno dotyczyć jednej logicznej zmiany.
- Po utworzeniu Issue podaj jego numer i link.

### Implementacja

- Pracuj na podstawie istniejącego Issue.
- Przed większym zadaniem przygotuj plan.
- Implementuj wymagane funkcjonalności.
- Po implementacji uruchom dostępne testy.
- Wykonaj Code Review.
- Poinformuj o zakończeniu pracy.

### Git – ograniczenia

- Nigdy nie wykonuj git commit.
- Nigdy nie wykonuj git push.
- Nigdy nie wykonuj git merge.
- Nie twórz ani nie publikuj Pull Requestów.
- Nie wykonuj operacji destrukcyjnych na historii Git.
- Nie modyfikuj istniejących commitów.
- Nie wykonuj operacji na zdalnym repozytorium
  poza uzgodnionym zarządzaniem Issues.

### Po zakończeniu zadania

1. Podsumuj wykonane zmiany.
2. Wymień zmodyfikowane pliki.
3. Podaj wyniki testów.
4. Zaproponuj nazwę commita zgodną
   z Conventional Commits.
5. Podaj numer powiązanego Issue.
6. Pozostaw wszystkie zmiany niezatwierdzone.

Użytkownik samodzielnie wykonuje commity,
push oraz zarządza Pull Requestami.
