# Marketplace – Wymagania projektu

## 1. Opis projektu

Marketplace to aplikacja internetowa umożliwiająca użytkownikom kupowanie i sprzedawanie przedmiotów, podobna funkcjonalnie do Vinted.

Użytkownicy będą mogli tworzyć konta, publikować ogłoszenia, przeglądać produkty innych użytkowników i dodawać je do ulubionych.

Aplikacja będzie rozwijana etapami. W pierwszej kolejności powstanie MVP (Minimum Viable Product), czyli podstawowa działająca wersja aplikacji.

## 2. Technologie

Aktualnie wykorzystywane:

- React
- TypeScript
- Vite
- React Compiler 

Do ustalenia:

- Biblioteka stylowania
- Routing
- Backend
- Baza danych
- Uwierzytelnianie
- Przechowywanie zdjęć
- System testowania
- Hosting

Nie należy wybierać dodatkowych technologii bez wcześniejszego przeanalizowania wymagań.

## 3. Role użytkowników

### Gość

- Przeglądanie ogłoszeń
- Wyszukiwanie produktów
- Filtrowanie ogłoszeń
- Przeglądanie szczegółów produktu
- Rejestracja i logowanie

### Zalogowany użytkownik

- Wszystkie możliwości gościa
- Zarządzanie własnym profilem
- Dodawanie ogłoszeń
- Edytowanie własnych ogłoszeń
- Usuwanie własnych ogłoszeń
- Dodawanie produktów do ulubionych
- Przeglądanie własnych ogłoszeń

### Administrator (przyszły etap)

- Zarządzanie zgłoszonymi ogłoszeniami
- Moderowanie niedozwolonych treści
- Zarządzanie użytkownikami

## 4. MVP – podstawowe funkcjonalności

### 4.1 Rejestracja i logowanie

- Rejestracja za pomocą adresu e-mail i hasła
- Logowanie użytkownika
- Wylogowanie
- Walidacja formularzy
- Komunikaty o błędach
- Ochrona stron wymagających logowania

### 4.2 Profil użytkownika

- Wyświetlanie nazwy użytkownika
- Edytowanie danych profilu
- Dodawanie zdjęcia profilowego
- Wyświetlanie własnych ogłoszeń

### 4.3 Ogłoszenia

Użytkownik może:

- Dodać nowe ogłoszenie
- Ustawić tytuł ogłoszenia
- Dodać opis produktu
- Określić cenę
- Wybrać kategorię
- Określić stan produktu
- Dodać zdjęcia produktu
- Edytować własne ogłoszenie
- Usunąć własne ogłoszenie
- Oznaczyć ogłoszenie jako sprzedane

### 4.4 Strona główna

- Wyświetlanie dostępnych produktów
- Karty produktów ze zdjęciem, ceną i nazwą
- Przejście do szczegółów produktu
- Responsywny układ siatki produktów
- Obsługa stanu ładowania i pustej listy

### 4.5 Wyszukiwanie i filtrowanie

- Wyszukiwanie po nazwie produktu
- Filtrowanie według kategorii
- Filtrowanie według przedziału cenowego
- Filtrowanie według stanu produktu
- Sortowanie produktów według ceny i daty dodania

### 4.6 Szczegóły produktu

- Galeria zdjęć
- Nazwa i opis produktu
- Cena
- Stan i kategoria
- Informacje o sprzedającym
- Przycisk dodania do ulubionych

### 4.7 Ulubione

- Dodawanie ogłoszeń do ulubionych
- Usuwanie ogłoszeń z ulubionych
- Osobna lista ulubionych produktów
- Zapisywanie ulubionych dla zalogowanego użytkownika

## 5. Funkcjonalności przyszłych wersji

Nie implementować w pierwszym etapie bez dodatkowej decyzji.

### Wiadomości

- Prywatne rozmowy kupującego ze sprzedającym
- Historia konwersacji
- Powiadomienia o nowych wiadomościach

### Transakcje

- Kupowanie przedmiotów
- Integracja z operatorem płatności
- Historia zakupów i sprzedaży
- Statusy zamówień

### Dostawa

- Wybór metody dostawy
- Integracja z firmami kurierskimi
- Śledzenie przesyłek

### Opinie i oceny

- Ocenianie sprzedających
- Dodawanie opinii po transakcji
- Wyświetlanie średniej oceny

### Panel administratora

- Moderowanie ogłoszeń
- Obsługa zgłoszeń użytkowników
- Blokowanie nieodpowiednich treści

## 6. Wymagania wizualne

- Nowoczesny, czytelny interfejs
- Responsywność na telefonach, tabletach i komputerach
- Spójna kolorystyka
- Czytelna typografia
- Intuicyjna nawigacja
- Karty produktów z dużymi zdjęciami
- Komunikaty błędów i sukcesu
- Stany loading, empty i error
- Podstawowa dostępność zgodna z WCAG

Projekt może inspirować się funkcjonalnością aplikacji marketplace, ale powinien mieć własną identyfikację wizualną.

## 7. Wymagania bezpieczeństwa

- Użytkownik może edytować tylko własne ogłoszenia
- Użytkownik nie może uzyskać dostępu do prywatnych danych innych użytkowników
- Uprawnienia muszą być weryfikowane po stronie backendu lub przez reguły bezpieczeństwa bazy danych
- Dane formularzy wymagają walidacji
- Przesyłane pliki muszą być sprawdzane
- Sekrety nie mogą być przechowywane w repozytorium
- Należy zabezpieczyć operacje tworzenia, edycji i usuwania danych

## 8. Wymagania jakościowe

- Kod napisany w TypeScript
- Komponenty React wielokrotnego użytku
- Rozdzielenie UI od logiki biznesowej
- Czytelna struktura folderów
- Obsługa błędów
- Brak bezpośredniej mutacji stanu
- Podstawowe testy najważniejszych funkcjonalności
- Poprawne działanie na urządzeniach mobilnych

## 9. Kolejność implementacji

1. Przygotowanie architektury i konfiguracji projektu
2. Layout aplikacji i podstawowe komponenty UI
3. Routing i nawigacja
4. Rejestracja i logowanie
5. Profil użytkownika
6. Dodawanie i zarządzanie ogłoszeniami
7. Lista produktów i szczegóły ogłoszenia
8. Wyszukiwanie, filtry i sortowanie
9. Ulubione
10. Testowanie i przygotowanie MVP do wdrożenia

## 10. Zasady realizacji

- Implementuj funkcjonalności etapami.
- Nie implementuj całej aplikacji jednocześnie.
- Przed większą zmianą przygotuj plan.
- Nie dodawaj funkcjonalności spoza dokumentu bez uzgodnienia.
- W przypadku niejasnych wymagań przedstaw możliwe rozwiązania.
- Po zakończeniu etapu sprawdź poprawność implementacji.
- Nie traktuj przyszłych funkcjonalności jako części MVP.

## 11. Otwarte decyzje

Przed rozpoczęciem implementacji należy ustalić:

- Ostateczny zakres MVP
- Technologię backendu
- Bazę danych
- Sposób przechowywania zdjęć
- Bibliotekę stylowania
- Sposób obsługi formularzy
- System testowania
- Docelową architekturę projektu