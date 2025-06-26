using Cafe_ManagementDAL.Data;
using Cafe_ManagementDAL.Entities;
using Cafe_ManagementDAL.Entities.DTOs;
using Cafe_ManagementDAL.Enums;
using Cafe_ManagementDAL.Services.Intefaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Services {
	public class AuthService : IAuthService {

		readonly CafeContext _dbContext;

		public AuthService(CafeContext context) {
			_dbContext = context;
		}

		public async Task<string> Login(AuthRequest request) {
			var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.UserName == request.Username);
			if (user == null) {
				throw new NullReferenceException("User not found.");
			}
			if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt)) {
				throw new ArgumentException("Wrong password.");
			}
			string token = CreateToken(user);
			return token;
		}

		public async Task<User> Register(AuthRequest request, Role role = Role.USER) {
			var newUser = new User();
			newUser.Role = role;
			CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
			newUser.UserName = request.Username;
			newUser.PasswordHash = passwordHash;
			newUser.PasswordSalt = passwordSalt;
			_dbContext.Users.Add(newUser);
			await _dbContext.SaveChangesAsync();

			return newUser;
		}

		public async Task ChangeCredentials(ChangeCredentialsDTO credDto) {
			var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.UserName == credDto.Username);
			if (user == null) {
				throw new NullReferenceException("User does not exist");
			}

			if (VerifyPasswordHash(credDto.OldPassword, user.PasswordHash, user.PasswordSalt)) {
				if (!string.IsNullOrEmpty(credDto.NewPassword)) {

					CreatePasswordHash(credDto.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);
					user.PasswordHash = passwordHash;
					user.PasswordSalt = passwordSalt;
					_dbContext.Users.Update(user);
					await _dbContext.SaveChangesAsync();

				}
				else throw new NullReferenceException("Password can't be empty");
			}
			else throw new ArgumentException("Old Password is incorrect");
 		}

		public async Task<string> RefreshToken(Guid id) {
			var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Id == id);
			if (user == null) {
				throw new NullReferenceException("User does not exist");
			}

			return CreateToken(user);
		}

		string CreateToken(User user) {

			List<Claim> claims = new List<Claim>
			{
				new Claim("id", user.Id.ToString()),
				new Claim("username", user.UserName),
				new Claim(ClaimTypes.Role, user.Role.ToString())
			};

			var key = Encoding.UTF8.GetBytes(JwtOptions.Key);
			var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken(
				issuer: JwtOptions.Issuer,
				audience: JwtOptions.Audience,
				claims: claims,
				expires: DateTime.Now.AddMinutes(7),
				signingCredentials: creds);

			var jwt = new JwtSecurityTokenHandler().WriteToken(token);

			return jwt;
		}

		void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt) {
			using (var hmac = new HMACSHA512()) {
				passwordSalt = hmac.Key;
				passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
			}
		}

		bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt) {
			using (var hmac = new HMACSHA512(passwordSalt)) {
				var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
				return computedHash.SequenceEqual(passwordHash);
			}
		}
	}
}
