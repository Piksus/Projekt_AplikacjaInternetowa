using EventMeet.Models;

namespace EventMeet.ViewModels;

public class ParticipantRow
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public ParticipantStatus Status { get; set; }
}

public class ManageParticipantsViewModel
{
    public int EventId { get; set; }
    public string EventTitle { get; set; } = string.Empty;
    public List<ParticipantRow> Participants { get; set; } = new();
}
