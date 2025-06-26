using Cafe_ManagementDAL.Data;
using Cafe_ManagementDAL.Entities;
using Cafe_ManagementDAL.Entities.DTOs;
using Cafe_ManagementDAL.Services;
using Cafe_ManagementDAL.Services.Intefaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Cafe_Management.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class OrdersController : ControllerBase
	{
		private readonly IOrderService _orderService;

		public OrdersController(IOrderService orderService)
		{
			_orderService = orderService;
		}

		[Authorize(Policy = "AdminOrOwner")]
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
		{
			return Ok(await _orderService.GetAllAsync());
		}

		[HttpGet("{userId}")] //Allow all to see their own orders
		public async Task<ActionResult<IEnumerable<Order>>> GetUsersOrders(Guid userId)
		{
			var userIdClaim = User.FindFirst("id");
			if (userIdClaim == null) {
				return NotFound();
			}
			if (Guid.Parse(userIdClaim.Value) != userId) {
				return Forbid();
			}
			return Ok(await _orderService.GetUsersOrdersAsync(userId));
		}

		[HttpGet("details/{id}")]
		public async Task<ActionResult<Order>> GetOrderDetails(Guid id)
		{

			var order = await _orderService.GetOrderDetailsAsync(id);
			return Ok(order);

		}

		[Authorize(Policy = "OwnerOnly")] // For owner use to manually update the order total amount (discounts, etc.)
		[HttpPut("{id}")]
		public async Task<IActionResult> PutOrder(Guid id, [FromBody]int updatedOrderAmount)
		{
			var order = await _orderService.GetByIdAsync(id); // Getting the existing order
																												//NO NEED TO CHECK FOR NULL HERE AS IT WILL BE HANDLED BY THE SERVICE
			order.TotalAmount = updatedOrderAmount;

			await _orderService.UpdateAsync(id, order);

			return NoContent();
		}

		[HttpPost] // Allow all users to place orders
		public async Task<ActionResult<Order>> PostOrder([FromBody] OrderDTO orderDto)
		{
			CheckoutRequest checkoutRequest = new CheckoutRequest
			{
				UserId = orderDto.UserId,
				BeverageItems = orderDto.Beverages.ToList()
			};

			var order = await _orderService.CheckoutAsync(checkoutRequest);

			return CreatedAtAction("GetOrder", new { id = order.Id }, order);
		}

		[Authorize(Policy = "OwnerOnly")] // For owner use to delete an order
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteOrder(Guid id)
		{

			await _orderService.DeleteAsync(id);
			//NO NEED TO CHECK FOR NULL HERE AS IT WILL BE HANDLED BY THE SERVICE

			return NoContent();
		}
	}
}
