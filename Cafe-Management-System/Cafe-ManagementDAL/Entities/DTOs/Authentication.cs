using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Entities.DTOs {
	public class AuthRequest {

		[Required(ErrorMessage = "Username is required.")]
		public string Username { get; set; }

		[Required(ErrorMessage = "Password is required.")]
		public string Password { get; set; }
	}

	public class ChangeCredentialsDTO  {
		[Required(ErrorMessage = "Username is required.")]
		public string Username { get; set; }

		[Required(ErrorMessage = "Old Password is required.")]
		public string OldPassword { get; set; }

		[Required(ErrorMessage = "New Password is required.")]
		public string NewPassword { get; set; }
	}
}
