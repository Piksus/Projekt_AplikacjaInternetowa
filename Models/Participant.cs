namespace EventMeet.Models;

public class Participant
{
    public int Id { get; set; }

    public int EventId { get; set; }
    public Event? Event { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public ParticipantStatus Status { get; set; } = ParticipantStatus.Pending;
}
