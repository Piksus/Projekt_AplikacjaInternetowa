using EventMeet.Models;

namespace EventMeet.ViewModels;

public class ParticipantStatusViewModel
{
    public string Name { get; set; } = string.Empty;
    public ParticipantStatus Status { get; set; }
}

public class EventDetailsViewModel
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string? PhotoPath { get; set; }
    public string? RulesFilePath { get; set; }

    public List<ParticipantStatusViewModel> Participants { get; set; } = new();

    public int GoingCount => Participants.Count(p => p.Status == ParticipantStatus.Going);
    public int MaybeCount => Participants.Count(p => p.Status == ParticipantStatus.Maybe);
    public int NotGoingCount => Participants.Count(p => p.Status == ParticipantStatus.NotGoing);
    public int PendingCount => Participants.Count(p => p.Status == ParticipantStatus.Pending);
    public int TotalCount => Participants.Count;
}
