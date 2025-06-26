using Cafe_ManagementDAL.Data;
using Cafe_ManagementDAL.Entities;
using Cafe_ManagementDAL.Entities.DTOs;
using Cafe_ManagementDAL.Enums;
using Cafe_ManagementDAL.Services;
using Cafe_ManagementDAL.Services.Intefaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Cafe_Management.Controllers
{
	[Authorize(Policy = "AdminOrOwner")]
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IUserService _userService;
		private readonly IAuthService _authService;

		public UsersController(IUserService userService, IAuthService authService)
		{
			_userService = userService;
			_authService = authService;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<User>>> GetUsers()
		{

			return Ok(await _userService.GetAllAsync());

		}

		[HttpGet("{id}")]
		public async Task<ActionResult<User>> GetUser(Guid id)
		{

			var user = await _userService.GetByIdAsync(id); //NO NEED TO CHECK FOR NULL HERE AS IT WILL BE HANDLED BY THE SERVICE

			return user;

		}

		[HttpPut("{id}")] //Only owner can make users an admin or owner
		public async Task<IActionResult> PutUser(Guid id, UserDTO userDto)
		{

			var user = await _userService.GetByIdAsync(id); // Getting the existing user//NO NEED TO CHECK FOR NULL HERE AS IT WILL BE HANDLED BY THE SERVICE
			var senderRoleFromClaims = User.FindFirst(ClaimTypes.Role)?.Value;

			if (user.Role == Role.OWNER) {//if trying to downgrade owner to user - prevent
				return Forbid();
			} 

			user.Role = Role.USER;

			if ((userDto.Role == Role.ADMIN || userDto.Role == Role.OWNER) && senderRoleFromClaims == Role.OWNER.ToString()) // Only owner can add admins or owners
			{
				user.Role = userDto.Role;
			}


			user.UserName = userDto.UserName;
			await _userService.UpdateAsync(id, user);

			return NoContent();
		}

		[HttpPost] //Only owners can make user admin or owner
		public async Task<ActionResult<User>> PostUser(UserDTO userDto, Role senderRole)
		{

			if (string.IsNullOrEmpty(userDto.UserName))
			{
				return BadRequest("Username can't be empty.");
			}
			var senderRoleFromClaims = User.FindFirst(ClaimTypes.Role)?.Value;
			var roleToAssign = Role.USER; // Default role is USER

			if ((userDto.Role == Role.ADMIN || userDto.Role == Role.OWNER) && senderRoleFromClaims == Role.OWNER.ToString()) // Only owner can add admins or owners
			{
				roleToAssign = userDto.Role;
			}

			User newUser = await _authService.Register(new AuthRequest
			{
				Username = userDto.UserName,
				Password = "123456" // Default password, should be changed by the user
			}, roleToAssign);

			return CreatedAtAction("GetUser", new { id = newUser.Id }, newUser);
		}
		
		[HttpDelete("{id}")] // Admins can only delete USERS / OWNERS can delete anyone
		public async Task<IActionResult> DeleteUser(Guid id)
		{
			var user = await _userService.GetByIdAsync(id);
			var senderRoleFromClaims = User.FindFirst(ClaimTypes.Role)?.Value;

			if ((user.Role == Role.ADMIN || user.Role == Role.OWNER) && senderRoleFromClaims != Role.OWNER.ToString()) {

				return Forbid();
			}
			await _userService.DeleteAsync(id);
			return NoContent();

		}
	}
}
