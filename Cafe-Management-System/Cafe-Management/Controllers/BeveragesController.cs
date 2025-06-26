using Cafe_ManagementDAL.Data;
using Cafe_ManagementDAL.Entities;
using Cafe_ManagementDAL.Entities.DTOs;
using Cafe_ManagementDAL.Enums;
using Cafe_ManagementDAL.Services.Intefaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cafe_Management.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BeveragesController : ControllerBase
	{

		private readonly IBeverageService _beverageService;

		public BeveragesController(IBeverageService beverageService)
		{

			_beverageService = beverageService;
		}

		[Authorize]
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Beverage>>> GetBeverages()
		{

			return Ok(await _beverageService.GetAllAsync());

		}

		[Authorize]
		[HttpGet("{id}")]
		public async Task<ActionResult<Beverage>> GetBeverage(Guid id)
		{

			var beverage = await _beverageService.GetByIdAsync(id); //NO NEED TO CHECK FOR NULL HERE AS IT WILL BE HANDLED BY THE SERVICE

			return Ok(beverage);
		}

		[Authorize(Policy = "AdminOrOwner")]
		[HttpPut("{id}")] //AUTHORIZED - ADMIN OR OWNER
		public async Task<IActionResult> PutBeverage(Guid id, int unitsInStock, int newPrice = 0)
		{

			var beverage = await _beverageService.GetByIdAsync(id); // Getting the existing beverage
																															//NO NEED TO CHECK FOR NULL HERE AS IT WILL BE HANDLED BY THE SERVICE
			if (newPrice != 0) beverage.Price = newPrice;
			beverage.UnitsInStock = unitsInStock;
			await _beverageService.UpdateAsync(id, beverage);



			return NoContent(); //204
		}

		[Authorize(Policy = "AdminOrOwner")]
		[HttpPost] //AUTHORIZED - ADMIN OR OWNER
		public async Task<ActionResult<Beverage>> PostBeverage(BeverageDTO beverageDto)
		{
			if (beverageDto == null)
			{
				return BadRequest("Beverage data is required.");
			}
			if (beverageDto.Price <= 0)
			{
				return BadRequest("Price must be a positive value.");
			}
			if (beverageDto.Quantity < 0)
			{
				return BadRequest("Units in stock cannot be negative.");
			}
			Beverage beverage = new Beverage
			{
				Id = Guid.NewGuid(),
				Type = beverageDto.Type,
				Price = beverageDto.Price,
				UnitsInStock = beverageDto.Quantity
			};

			await _beverageService.CreateAsync(beverage);


			return CreatedAtAction("GetBeverage", new { id = beverage.Id }, beverage);
		}

		[Authorize(Policy = "AdminOrOwner")]
		[HttpDelete("{id}")] //AUTHORIZED - ADMIN OR OWNER
		public async Task<IActionResult> DeleteBeverage(Guid id)
		{
			await _beverageService.DeleteAsync(id);
			//NO NEED TO CHECK FOR NULL HERE AS IT WILL BE HANDLED BY THE SERVICE

			return NoContent();
		}
	}
}
