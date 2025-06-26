using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Entities.DTOs {

	public class CheckoutRequest {
		public Guid UserId { get; set; }
		public List<OrderItemDTO> BeverageItems { get; set; } = [];
	}
}
