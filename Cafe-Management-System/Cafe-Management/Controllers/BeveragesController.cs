using System.IO;
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
		private readonly IWebHostEnvironment _env;

		public BeveragesController(IBeverageService beverageService, IWebHostEnvironment webHostEnvironment)
		{
			_beverageService = beverageService;
			_env = webHostEnvironment;
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
		public async Task<ActionResult<Beverage>> PostBeverage([FromForm] BeverageDTO beverageDto)
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
			var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", "ico", ".webp" };
			var extension = Path.GetExtension(beverageDto.Image.FileName).ToLowerInvariant();
			if (!allowedExtensions.Contains(extension)) {
				return BadRequest("Only image files (.jpg, .jpeg, .png, .gif .ico, .webp) are allowed.");
			}
			if (beverageDto.Image == null || beverageDto.Image.Length == 0) {
				return BadRequest("Image is required.");
			}

			var uploads = Path.Combine(_env.WebRootPath, "images");
			Directory.CreateDirectory(uploads);

			var filename = beverageDto.Type + Path.GetExtension(beverageDto.Image.FileName);
			var filePath = Path.Combine(uploads, filename);

			using (var stream = new FileStream(filePath, FileMode.Create)) {
				await beverageDto.Image.CopyToAsync(stream);
			}

			var imageUrl = $"{Request.Scheme}://{Request.Host}/images/{filename}";
			Beverage beverage = new Beverage
			{
				Id = Guid.NewGuid(),
				Type = beverageDto.Type,
				Price = beverageDto.Price,
				UnitsInStock = beverageDto.Quantity,
				ImageUrl = imageUrl
			};

			await _beverageService.CreateAsync(beverage);


			return CreatedAtAction("GetBeverage", new { id = beverage.Id }, beverage);
		}


		[Authorize(Policy = "AdminOrOwner")]
		[HttpDelete("{id}")] //AUTHORIZED - ADMIN OR OWNER
		public async Task<IActionResult> DeleteBeverage(Guid id)
		{
			var beverage = await _beverageService.GetByIdAsync(id);
			if (!string.IsNullOrEmpty(beverage.ImageUrl)) {
				// Extract filename from URL
				var filename = Path.GetFileName(new Uri(beverage.ImageUrl).LocalPath);
				var imagePath = Path.Combine(_env.WebRootPath, "images", filename);

				if (System.IO.File.Exists(imagePath)) {
					System.IO.File.Delete(imagePath);
				}
			}
			await _beverageService.DeleteAsync(id);
			//NO NEED TO CHECK FOR NULL HERE AS IT WILL BE HANDLED BY THE SERVICE

			return NoContent();
		}
	}
}
