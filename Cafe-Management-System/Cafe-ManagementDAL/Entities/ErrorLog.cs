public class ErrorLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Message { get; set; } = null!;
    public string? StackTrace { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
