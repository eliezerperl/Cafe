using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Entities.DTOs {
	public class OrderDTO {
		public Guid Id { get; set; }

		public string CustomerName { get; set; }

		public ICollection<OrderItemDTO> Beverages { get; set; } = [];

		public int TotalAmount { get; set; }

		public Guid UserId { get; set; }
		public User User { get; set; }
	}

	public class OrderItemDTO {
		public Guid BeverageId { get; set; }
		public string Type { get; set; }
		public int Price { get; set; }
		public int Quantity { get; set; }
	}
}
