using Cafe_ManagementDAL.Entities.Interfaces;
using Cafe_ManagementDAL.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Entities {
	public class User : IEntity {

		[Key]
		public Guid Id { get; set; } = Guid.NewGuid();

		[Required(ErrorMessage = "User name is required.")]
		public string UserName { get; set; }

		public byte[] PasswordHash { get; set; }

		public byte[] PasswordSalt { get; set; }

		public Role Role { get; set; }

	}
}
