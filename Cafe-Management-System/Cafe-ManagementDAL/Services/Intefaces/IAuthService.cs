using Cafe_ManagementDAL.Entities;
using Cafe_ManagementDAL.Entities.DTOs;
using Cafe_ManagementDAL.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Services.Intefaces {
	public interface IAuthService {
		Task<User> Register(AuthRequest request, Role role = Role.USER);

		Task<string> Login(AuthRequest request);

		Task ChangeCredentials(ChangeCredentialsDTO credDto);

		Task<string> RefreshToken(Guid id);
	}
}
