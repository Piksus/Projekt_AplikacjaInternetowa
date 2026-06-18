using EventMeet.Data;
using EventMeet.Models;
using EventMeet.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventMeet.Controllers;

public class EventsController : Controller
{
    private readonly ApplicationDbContext _db;

    public EventsController(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IActionResult> Index()
    {
        var events = await _db.Events
            .Include(e => e.Category)
            .Include(e => e.Participants)
            .OrderBy(e => e.EventDate)
            .ToListAsync();

        var list = events.Select(e => new EventListItemViewModel
        {
            Id = e.Id,
            Title = e.Title,
            EventDate = e.EventDate,
            Location = e.Location,
            CategoryName = e.Category?.Name ?? "",
            PhotoPath = e.PhotoPath,
            GoingCount = e.Participants.Count(p => p.Status == ParticipantStatus.Going),
            MaybeCount = e.Participants.Count(p => p.Status == ParticipantStatus.Maybe),
            NotGoingCount = e.Participants.Count(p => p.Status == ParticipantStatus.NotGoing),
            PendingCount = e.Participants.Count(p => p.Status == ParticipantStatus.Pending)
        }).ToList();

        return View(list);
    }

    public async Task<IActionResult> Details(int id)
    {
        var ev = await _db.Events.Include(e => e.Category).Include(e => e.Participants)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (ev == null) return NotFound();

        var vm = new EventDetailsViewModel
        {
            Id = ev.Id,
            Title = ev.Title,
            Description = ev.Description,
            EventDate = ev.EventDate,
            Location = ev.Location,
            CategoryName = ev.Category?.Name ?? "",
            PhotoPath = ev.PhotoPath,
            RulesFilePath = ev.RulesFilePath,
            Participants = ev.Participants.Select(p => new ParticipantStatusViewModel
            {
                Name = p.Name,
                Status = p.Status
            }).ToList()
        };

        return View(vm);
    }
}
