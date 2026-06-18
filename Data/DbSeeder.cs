using EventMeet.Models;

namespace EventMeet.Data;

public static class DbSeeder
{
    public static void Seed(ApplicationDbContext db)
    {
        if (db.Categories.Any()) return;

        var categories = new List<Category>
        {
            new Category { Name = "Mecz" },
            new Category { Name = "Grill" },
            new Category { Name = "Wyjazd" },
            new Category { Name = "Impreza" },
            new Category { Name = "Inne" }
        };
        db.Categories.AddRange(categories);
        db.SaveChanges();

        var grill = categories.First(c => c.Name == "Grill");
        var mecz = categories.First(c => c.Name == "Mecz");

        var event1 = new Event
        {
            Title = "Grill u Marka",
            Description = "Wspolne grillowanie w ogrodzie, kazdy przynosi cos do jedzenia. Bedzie muzyka i gry planszowe.",
            EventDate = DateTime.Now.AddDays(7),
            Location = "ul. Sloneczna 12, Krakow",
            CategoryId = grill.Id
        };
        var event2 = new Event
        {
            Title = "Mecz pilkarski - sparing",
            Description = "Towarzyski mecz 7 na 7 na boisku ze sztuczna trawa. Potrzebne korki.",
            EventDate = DateTime.Now.AddDays(3),
            Location = "Boisko Orlik, ul. Sportowa 5",
            CategoryId = mecz.Id
        };
        var wyjazd = categories.First(c => c.Name == "Wyjazd");
        var event3 = new Event
        {
            Title = "Wyjazd integracyjny w gory",
            Description = "Weekendowy wyjazd, dwa dni, nocleg w schronisku. Szczegoly w regulaminie.",
            EventDate = DateTime.Now.AddDays(21),
            Location = "Zakopane",
            CategoryId = wyjazd.Id
        };

        db.Events.AddRange(event1, event2, event3);
        db.SaveChanges();

        db.Participants.AddRange(
            new Participant { EventId = event1.Id, Name = "Anna Kowalska", Email = "anna@example.com" },
            new Participant { EventId = event1.Id, Name = "Jan Nowak", Email = "jan@example.com", Status = ParticipantStatus.Going },
            new Participant { EventId = event1.Id, Name = "Ewa Wisniewska", Email = "ewa@example.com", Status = ParticipantStatus.NotGoing },
            new Participant { EventId = event2.Id, Name = "Piotr Zielinski", Email = "piotr@example.com", Status = ParticipantStatus.Maybe },
            new Participant { EventId = event3.Id, Name = "Kasia Mazur", Email = "kasia@example.com" }
        );
        db.SaveChanges();
    }
}
