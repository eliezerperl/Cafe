using Cafe_ManagementDAL.Entities.Interfaces;
using Cafe_ManagementDAL.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Entities {
	public class Beverage : IEntity {

		[Key]
		public Guid Id { get; set; }

		[Required]
		public string Type { get; set; }

		[Required(ErrorMessage = "Price is required.")]
		[Range(0.01, double.MaxValue, ErrorMessage = "Price must be a positive value.")]
		public int Price { get; set; }

		[Range(0, int.MaxValue, ErrorMessage = "Units in stock cannot be negative.")]
		public int UnitsInStock { get; set; } = 0;

	}
}
