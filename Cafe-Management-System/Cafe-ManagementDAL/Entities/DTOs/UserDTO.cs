using Cafe_ManagementDAL.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Entities.DTOs {
	public class UserDTO {
		public Guid Id { get; set; }

		public string UserName { get; set; }

		public Role Role { get; set; }
	}
}
