using System.Net;
using System.Text.Json;

namespace Cafe_Management {
	public class ExceptionMiddleware {

		private readonly RequestDelegate _next;
		private readonly ILogger<ExceptionMiddleware> _logger;

		public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger) {
			_next = next;
			_logger = logger;
		}

		public async Task InvokeAsync(HttpContext context) {
			try {
				await _next(context);
			}
			catch (ArgumentException ex) {
				_logger.LogError(ex, $"Something went wrong: {ex.Message}");
				await HandleExceptionAsync(context, ex);
			}
			catch (NullReferenceException ex) {
				_logger.LogError(ex, $"Something went wrong: {ex.Message}");
				await HandleExceptionAsync(context, ex);
			}
			catch (UnauthorizedAccessException ex) {
				_logger.LogError(ex, $"Something went wrong: {ex.Message}");
				await HandleExceptionAsync(context, ex);
			}
			catch (InvalidOperationException ex) {
				_logger.LogError(ex, $"Something went wrong: {ex.Message}");
				await HandleExceptionAsync(context, ex);
			}
			catch (Exception ex) {
				_logger.LogError(ex, $"Something went wrong: {ex.Message}");
				await HandleExceptionAsync(context, ex);
			}
		}

		private static Task HandleExceptionAsync(HttpContext context, Exception exception) {
			context.Response.ContentType = "application/json";

			if (exception is ArgumentException) {
				context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
			} else if (exception is NullReferenceException) {
				context.Response.StatusCode = (int)HttpStatusCode.NotFound;
			}
			else {
				context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
			}

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
