namespace EventMeet.Models;

public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string Location { get; set; } = string.Empty;

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public string? PhotoPath { get; set; }
    public string? RulesFilePath { get; set; }

    public List<Participant> Participants { get; set; } = new();
}
