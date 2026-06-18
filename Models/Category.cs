namespace EventMeet.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public List<Event> Events { get; set; } = new();
}
