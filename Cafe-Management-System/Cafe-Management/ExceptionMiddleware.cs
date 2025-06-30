using Cafe_ManagementDAL.Data;
using System;
using System.Net;
using System.Text.Json;

namespace Cafe_Management {
	public class ExceptionMiddleware {

		private readonly RequestDelegate _next;
		private readonly ILogger<ExceptionMiddleware> _logger;
		private readonly IServiceScopeFactory _scopeFactory;

		public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IServiceScopeFactory scopeFactory) {
			_next = next;
			_logger = logger;
			_scopeFactory = scopeFactory;
		}

		public async Task InvokeAsync(HttpContext context) {
			try {
				await _next(context);
			}
			catch (Exception ex) {
				_logger.LogError(ex, $"Something went wrong: {ex.Message}");

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
