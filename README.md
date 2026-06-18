# EventMeet - System Organizacji Nieformalnych Wydarzeń

Aplikacja webowa do organizacji nieformalnych spotkań (mecze, grille, wyjazdy, imprezy)
zamiast komunikacji przez czaty/komunikatory.

## Technologie

- ASP.NET Core MVC (.NET 8)
- Entity Framework Core (SQL Server / LocalDB)
- HTML5, CSS3 (RWD), JavaScript
- Wzorzec MVC z ViewModelami agregującymi dane (statusy uczestnictwa liczone dynamicznie
  na podstawie potwierdzeń, patrz `ViewModels/EventDetailsViewModel.cs` i `EventListItemViewModel.cs`)

## Struktura projektu

```
Models/         - encje EF Core (Event, Category, Participant, ParticipantStatus)
Data/           - ApplicationDbContext + DbSeeder (dane przykładowe)
ViewModels/     - modele widoków, agregacja statusów RSVP
Controllers/    - logika MVC
  EventsController   - publiczna lista i szczegóły wydarzeń (bez logowania)
  AccountController   - logowanie organizatora
  AdminController     - panel CMS: CRUD wydarzeń, upload zdjęcia/regulaminu, uczestnicy i ich statusy
Views/          - widoki Razor, style w wwwroot/css/style.css (oparte na designie EventManager)
wwwroot/uploads - przechowywane pliki (zdjęcia wydarzeń, regulaminy)
```

## Uruchomienie (Visual Studio 2022 / .NET 8 SDK)

1. Wymagany .NET 8 SDK oraz SQL Server LocalDB (instalowany domyślnie z Visual Studio,
   komponent "ASP.NET and web development").
2. Otwórz folder w Visual Studio (Open Folder) albo wygeneruj `.sln` (`dotnet new sln && dotnet sln add EventMeet.csproj`).
3. Connection string w `appsettings.json` wskazuje na `(localdb)\MSSQLLocalDB` - jeśli masz
   pełny SQL Server (np. Express), zmień go na właściwy.
4. Uruchom `dotnet restore` a następnie `dotnet run` (albo F5 w Visual Studio).
5. Baza danych tworzona jest automatycznie przy starcie (`Database.EnsureCreated()`) i
   wypełniana danymi przykładowymi (3 wydarzenia, kilku uczestników).

## Logowanie do panelu organizatora

Dane logowania są zapisane na sztywno w kodzie (`Controllers/AccountController.cs`) -
zgodnie z założeniem "najprościej jak się da", bez tabeli użytkowników:

```
login:  organizator
hasło:  haslo123
```

Adres: `/Account/Login`

## Uwaga dot. EF Core (uproszczenie)

Projekt korzysta z `Database.EnsureCreated()` zamiast pełnych migracji EF Core
(`dotnet ef migrations`). To najprostsze podejście do uruchomienia bazy bez dodatkowych
kroków CLI. Jeśli prowadzący wymaga klasycznych migracji, można je dodać:

```
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate
dotnet ef database update
```

(i usunąć wywołanie `EnsureCreated()` z `Program.cs`, żeby nie kolidowało z migracjami).

## Mechanizm potwierdzania udziału (RSVP)

Każdy uczestnik ma status: Brak odpowiedzi / Idę / Może / Nie idę. Status nie jest
ustawiany samodzielnie przez uczestnika przez link - organizator zmienia go ręcznie
w panelu (`Admin/Participants/{id}`) po tym, jak dowie się o decyzji uczestnika
(np. telefonicznie, mailowo, na czacie). To najprostsze podejście - bez generowania
unikalnych linków i bez dodatkowej tabeli/logiki do obsługi samoobsługowych potwierdzeń.

Strona publiczna wydarzenia (`/Events/Details/{id}`) i tak pokazuje aktualne statusy
wszystkich uczestników oraz zliczenia (Idę/Może/Nie idę/Brak odpowiedzi) - więc każdy,
kto ma link do wydarzenia, widzi kto bierze udział.

## Podział odpowiedzialności (zgodnie z wytycznymi projektu)

- **Osoba 1 (Frontend & UX):** `Views/`, `wwwroot/css/style.css`, `wwwroot/js/site.js`,
  responsywność (media queries), karty wydarzeń/uczestników, User Manual (patrz `USER_MANUAL.md`).
- **Osoba 2 (Backend & Architektura):** `Models/`, `Data/`, `Controllers/`, `ViewModels/`,
  logika RSVP i agregacji statusów, autoryzacja organizatora, upload plików, ten README.
