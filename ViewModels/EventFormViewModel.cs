using System.ComponentModel.DataAnnotations;

namespace EventMeet.ViewModels;

public class EventFormViewModel
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Nazwa jest wymagana")]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Data jest wymagana")]
    public DateTime EventDate { get; set; } = DateTime.Now.AddDays(1);

    [Required(ErrorMessage = "Miejsce jest wymagane")]
    public string Location { get; set; } = string.Empty;

    [Required(ErrorMessage = "Wybierz kategorie")]
    public int CategoryId { get; set; }

    public IFormFile? Photo { get; set; }
    public IFormFile? RulesFile { get; set; }

    public string? ExistingPhotoPath { get; set; }
    public string? ExistingRulesFilePath { get; set; }

    public List<CategoryOption> CategoryOptions { get; set; } = new();
}

public class CategoryOption
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
