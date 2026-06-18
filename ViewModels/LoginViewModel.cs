using System.ComponentModel.DataAnnotations;

namespace EventMeet.ViewModels;

public class LoginViewModel
{
    [Required(ErrorMessage = "Podaj login")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Podaj haslo")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;

    public string? ErrorMessage { get; set; }
}
