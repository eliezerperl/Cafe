using Cafe_ManagementDAL.Data;
using System;
using System.Net;
using System.Text.Json;

namespace Cafe_Management {
	public class ExceptionMiddleware {

		private readonly RequestDelegate _next;
		private readonly ILogger<ExceptionMiddleware> _logger;
		private readonly IServiceScopeFactory _scopeFactory;
		IWebHostEnvironment _env;
		private readonly string _fallbackLogPath;

		public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IServiceScopeFactory scopeFactory, IWebHostEnvironment env) {
			_next = next;
			_logger = logger;
			_scopeFactory = scopeFactory;
			_env = env;

			var logsDirectory = Path.Combine(env.ContentRootPath, "..", "logs");
			Directory.CreateDirectory(logsDirectory);

			_fallbackLogPath = Path.Combine(logsDirectory, "errorlog.txt");
		}

		public async Task InvokeAsync(HttpContext context) {
			try {
				await _next(context);
			}
			catch (Exception ex) {
				_logger.LogError(ex, $"Something went wrong: {ex.Message}");

				try {
					// Logging to db
					using var scope = _scopeFactory.CreateScope();
					var db = scope.ServiceProvider.GetRequiredService<CafeContext>();
					db.ErrorLogs.Add(new ErrorLog
					{
						Message = ex.Message,
						StackTrace = ex.StackTrace,
						CreatedAt = DateTime.Now
					});
					await db.SaveChangesAsync();
					_logger.LogInformation("Logged error to db succesfully");
				}
				catch (Exception dbEx) {

					// logging to file if db is unavailable
					var fallbackMessage = $"[{DateTime.Now}] DB Logging Failed: {dbEx.Message}\n" +
										  $"Original Error: {ex.Message}\n" +
										  $"StackTrace: {ex.StackTrace}\n" +
										  "---------------------------------------------------------------------------------\n";
					try {
						await File.AppendAllTextAsync(_fallbackLogPath, fallbackMessage);
						_logger.LogInformation($"Logged error to {Path.GetFullPath(_fallbackLogPath)} succesfully");
					}
					catch (Exception fileEx) {
						_logger.LogError(fileEx, "Failed to write to fallback error log file.");
					}
				}

				await HandleExceptionAsync(context, ex);
			}
		}

		private static Task HandleExceptionAsync(HttpContext context, Exception exception) {
			context.Response.ContentType = "application/json";

			context.Response.StatusCode = exception switch
			{
				ArgumentException => (int)HttpStatusCode.BadRequest,
				NullReferenceException => (int)HttpStatusCode.NotFound,
				_ => (int)HttpStatusCode.InternalServerError
			};

			var response = new
			{
				context.Response.StatusCode,
				//Message = "Internal Server Error from the custom middleware.",
				Detailed = exception.Message
			};

			var jsonResponse = JsonSerializer.Serialize(response);
			return context.Response.WriteAsync(jsonResponse);
		}
	}
}
