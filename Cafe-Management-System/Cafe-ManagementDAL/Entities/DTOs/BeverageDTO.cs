using Cafe_ManagementDAL.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Entities.DTOs
{
	public class BeverageDTO
	{

		public Guid Id { get; set; }

		[Required]
		public string Type { get; set; }

		[Required]
		public int Quantity { get; set; }

		[Required]
		public int Price { get; set; }

	}
}
