using EventMeet.Data;
using EventMeet.Models;
using EventMeet.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EventMeet.Controllers;

[Authorize]
public class AdminController : Controller
{
    private readonly ApplicationDbContext _db;
    private readonly IWebHostEnvironment _env;

    public AdminController(ApplicationDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    public async Task<IActionResult> Index()
    {
        var events = await _db.Events.Include(e => e.Category).Include(e => e.Participants)
            .OrderBy(e => e.EventDate).ToListAsync();
        return View(events);
    }

    public async Task<IActionResult> Create()
    {
        var vm = new EventFormViewModel
        {
            CategoryOptions = await GetCategoryOptions()
        };
        return View(vm);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(EventFormViewModel vm)
    {
        if (!ModelState.IsValid)
        {
            vm.CategoryOptions = await GetCategoryOptions();
            return View(vm);
        }

        var ev = new Event
        {
            Title = vm.Title,
            Description = vm.Description,
            EventDate = vm.EventDate,
            Location = vm.Location,
            CategoryId = vm.CategoryId
        };

        ev.PhotoPath = await SaveFile(vm.Photo, "photos");
        ev.RulesFilePath = await SaveFile(vm.RulesFile, "docs");

        _db.Events.Add(ev);
        await _db.SaveChangesAsync();

        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id)
    {
        var ev = await _db.Events.FindAsync(id);
        if (ev == null) return NotFound();

        var vm = new EventFormViewModel
        {
            Id = ev.Id,
            Title = ev.Title,
            Description = ev.Description,
            EventDate = ev.EventDate,
            Location = ev.Location,
            CategoryId = ev.CategoryId,
            ExistingPhotoPath = ev.PhotoPath,
            ExistingRulesFilePath = ev.RulesFilePath,
            CategoryOptions = await GetCategoryOptions()
        };
        return View(vm);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(EventFormViewModel vm)
    {
        var ev = await _db.Events.FindAsync(vm.Id);
        if (ev == null) return NotFound();

        if (!ModelState.IsValid)
        {
            vm.CategoryOptions = await GetCategoryOptions();
            return View(vm);
        }

        ev.Title = vm.Title;
        ev.Description = vm.Description;
        ev.EventDate = vm.EventDate;
        ev.Location = vm.Location;
        ev.CategoryId = vm.CategoryId;

        var newPhoto = await SaveFile(vm.Photo, "photos");
        if (newPhoto != null) ev.PhotoPath = newPhoto;

        var newRules = await SaveFile(vm.RulesFile, "docs");
        if (newRules != null) ev.RulesFilePath = newRules;

        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var ev = await _db.Events.FindAsync(id);
        if (ev != null)
        {
            _db.Events.Remove(ev);
            await _db.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Participants(int id)
    {
        var ev = await _db.Events.Include(e => e.Participants).FirstOrDefaultAsync(e => e.Id == id);
        if (ev == null) return NotFound();

        var vm = new ManageParticipantsViewModel
        {
            EventId = ev.Id,
            EventTitle = ev.Title,
            Participants = ev.Participants.Select(p => new ParticipantRow
            {
                Id = p.Id,
                Name = p.Name,
                Email = p.Email,
                Status = p.Status
            }).ToList()
        };

        return View(vm);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateParticipantStatus(int id, int eventId, ParticipantStatus status)
    {
        var p = await _db.Participants.FindAsync(id);
        if (p != null)
        {
            p.Status = status;
            await _db.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Participants), new { id = eventId });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AddParticipant(int eventId, string name, string email)
    {
        if (!string.IsNullOrWhiteSpace(name) && !string.IsNullOrWhiteSpace(email))
        {
            _db.Participants.Add(new Participant { EventId = eventId, Name = name.Trim(), Email = email.Trim() });
            await _db.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Participants), new { id = eventId });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> RemoveParticipant(int id, int eventId)
    {
        var p = await _db.Participants.FindAsync(id);
        if (p != null)
        {
            _db.Participants.Remove(p);
            await _db.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Participants), new { id = eventId });
    }

    private async Task<List<CategoryOption>> GetCategoryOptions()
    {
        return await _db.Categories.Select(c => new CategoryOption { Id = c.Id, Name = c.Name }).ToListAsync();
    }

    private async Task<string?> SaveFile(IFormFile? file, string subfolder)
    {
        if (file == null || file.Length == 0) return null;

        var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", subfolder);
        Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"/uploads/{subfolder}/{fileName}";
    }
}
