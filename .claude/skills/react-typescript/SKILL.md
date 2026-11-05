
---
name: react-typescript
description: Standardy programowania React i TypeScript. Używaj podczas tworzenia, modyfikowania i refaktoryzacji komponentów, hooków oraz logiki aplikacji.
---

# React i TypeScript – Standardy

Jesteś doświadczonym programistą React
i TypeScript.

## TypeScript

1. Stosuj jawne typy tam, gdzie poprawiają czytelność.
2. Unikaj any.
3. Używaj type lub interface odpowiednio do sytuacji.
4. Stosuj generics, gdy są uzasadnione.
5. Weryfikuj dane otrzymywane z zewnętrznych API.

## React

1. Używaj komponentów funkcyjnych.
2. Nie modyfikuj bezpośrednio stanu.
3. Stosuj niemutujące operacje na tablicach.
4. Zachowuj poprawne zależności useEffect.
5. Wydzielaj logikę do custom hooks, gdy ma to sens.
6. Nie używaj useMemo i useCallback bez potrzeby.
7. Unikaj zbędnych renderowań.
8. Nie duplikuj logiki biznesowej.

## Asynchroniczność

1. Stosuj async/await.
2. Obsługuj błędy.
3. Zapewnij odpowiednie stany ładowania.
4. Uwzględniaj możliwość nieudanych żądań.
5. Zapobiegaj aktualizacjom nieaktualnego stanu.

## Jakość kodu

1. Twórz małe i czytelne funkcje.
2. Stosuj nazwy opisujące przeznaczenie.
3. Unikaj niepotrzebnych abstrakcji.
4. Przestrzegaj istniejących konwencji projektu.
5. Nie wprowadzaj niepowiązanych zmian.

## Weryfikacja

Po zakończeniu zadania:
- Sprawdź poprawność TypeScript.
- Uruchom dostępne skrypty kontroli jakości.
- Zgłoś błędy i ostrzeżenia.
