using Cafe_ManagementDAL.Entities;
using Cafe_ManagementDAL.Entities.DTOs;
using Cafe_ManagementDAL.Services.Intefaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using NuGet.Common;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Cafe_Management.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{

		private readonly IAuthService _authSrv;

		public AuthController(IAuthService authSrv)
		{
			_authSrv = authSrv;
		}

		//HTTP Post Register
		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] AuthRequest request)
		{
			if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
			{
				return BadRequest("Invalid registration data.");
			}

			User user = await _authSrv.Register(request);
			UserDTO userDto = new UserDTO
			{
				Id = user.Id,
				UserName = user.UserName,
				Role = user.Role,
			};

			return Ok(userDto);

		}

		//HTTP POST Login
		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] AuthRequest request)
		{
			if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
			{
				return BadRequest("Invalid login data.");
			}
			var token = await _authSrv.Login(request);

			Response.Cookies.Append("jwtToken", token, CookieOptions());

			return Ok(new { Token = token });
		}

		[HttpPost("logout")]
		public IActionResult Logout() {
			Response.Cookies.Delete("jwtToken");
			return NoContent(); // 204
		}

		[HttpPut("change-password")] //for any user to change password or username
		public async Task<IActionResult> ChangePasswordAction(ChangeCredentialsDTO credDto)
		{

			await _authSrv.ChangeCredentials(credDto); // This will update the user credentials in the database
																										 //NO NEED TO CHECK FOR NULL HERE AS IT WILL BE HANDLED BY THE SERVICE
			return NoContent();
		}

		[Authorize]
		[HttpPost("refresh/{id}")]//HTTP POST refresh
		public async Task<IActionResult> RefreshAuth(Guid id)
		{
			var token = await _authSrv.RefreshToken(id);

			Response.Cookies.Append("jwtToken", token, CookieOptions());

			return Ok(new { Token = token });
		}

		[ApiExplorerSettings(IgnoreApi = true)]
		public CookieOptions CookieOptions() {
			CookieOptions options = new CookieOptions
			{
				Expires = DateTime.UtcNow.AddMinutes(7),
				HttpOnly = true,
				SameSite = SameSiteMode.Strict,
				//Secure = true, //send through HTTPS only
			};
			return options;
		}
	}
}
