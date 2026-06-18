namespace EventMeet.ViewModels;

public class EventListItemViewModel
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string? PhotoPath { get; set; }

    public int GoingCount { get; set; }
    public int MaybeCount { get; set; }
    public int NotGoingCount { get; set; }
    public int PendingCount { get; set; }

    public bool IsPast => EventDate < DateTime.Now;
}
