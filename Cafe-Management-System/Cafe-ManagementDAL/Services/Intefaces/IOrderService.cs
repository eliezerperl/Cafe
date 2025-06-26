using Cafe_ManagementDAL.Entities;
using Cafe_ManagementDAL.Entities.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Services.Intefaces {
	public interface IOrderService : ICafeServiceBase<Order> {
		Task<Order> CheckoutAsync(CheckoutRequest request);

		Task<Order> GetOrderDetailsAsync(Guid orderId);

		Task<ICollection<Order>> GetUsersOrdersAsync(Guid userId);

	}
}
