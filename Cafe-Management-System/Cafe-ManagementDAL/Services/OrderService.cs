using Cafe_ManagementDAL.Data;
using Cafe_ManagementDAL.Entities;
using Cafe_ManagementDAL.Entities.DTOs;
using Cafe_ManagementDAL.Services.Intefaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Services {
	public class OrderService : CafeServiceBase<Order>, IOrderService {


		public OrderService(CafeContext context) : base(context) {
		}

		public async Task<Order> CheckoutAsync(CheckoutRequest request) {
			var user = await _dbContext.Users.Where(user => user.Id == request.UserId).SingleOrDefaultAsync();
			if (user == null)
				throw new Exception("User not found.");
			
			var beverageIds = request.BeverageItems.Select(item => item.BeverageId).ToList();

			var beverages = await _dbContext.Beverages
											.Where(b => beverageIds.Contains(b.Id))
											.ToListAsync();

			if (beverages.Count != beverageIds.Count) {
				throw new Exception("One or more beverages not found.");
			}


			var order = new Order
			{
				UserId = request.UserId,
				OrderDate = DateTime.Now,
				User = user,
				CustomerName = user.UserName,
			};

			var beverageOrders = request.BeverageItems.Select(item => {
				var beverage = beverages.First(b => b.Id == item.BeverageId);

				if (beverage.UnitsInStock < item.Quantity)
					throw new Exception($"Insufficient stock for {beverage.Type}");

				beverage.UnitsInStock -= item.Quantity;

				return new SingleBeverageTypeOrder
				{
					BeverageId = beverage.Id,
					Beverage = beverage,
					Order = order,
					OrderId = order.Id,
					Quantity = item.Quantity,
				};
			}).ToList();

			int totalAmount = beverageOrders.Sum(o => o.Beverage.Price * o.Quantity);

			order.TotalAmount = totalAmount;
			order.BeverageOrders = beverageOrders;

			_dbContext.Orders.Add(order);
			await _dbContext.SaveChangesAsync();

			return order;
		}

		public async Task<Order> GetOrderDetailsAsync(Guid orderId) {
			if (orderId == Guid.Empty) {
				throw new ArgumentException("No Order ID passed in");
			}
			var order = await _dbContext.Orders
				.Include(o => o.BeverageOrders)
				.ThenInclude(bo => bo.Beverage)
				.FirstOrDefaultAsync(o => o.Id == orderId);

			if (order == null)
				throw new NullReferenceException("Order not found");

			return order;
		}

		public async Task<ICollection<Order>> GetUsersOrdersAsync(Guid userId) {
			if (userId == Guid.Empty)
				throw new ArgumentException("Not a valid User ID");

			var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId); // this throws an exception built in if more than one found because its singleordefault not firstordefault
			if (user == null)
				throw new NullReferenceException("User not found");

			var orders = await _dbContext.Orders.Where(o => o.UserId == user.Id)
				.Include(o => o.BeverageOrders)
				.ThenInclude(bo => bo.Beverage)
				.ToListAsync();

			return orders;
		}
	}
}
