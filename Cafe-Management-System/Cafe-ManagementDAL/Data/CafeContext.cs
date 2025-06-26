using Cafe_ManagementDAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Data {
	public class CafeContext : DbContext {
		public CafeContext(DbContextOptions<CafeContext> options) : base(options) { }
		protected override void OnModelCreating(ModelBuilder modelBuilder) {
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<SingleBeverageTypeOrder>()
						.HasKey(bo => new { bo.OrderId, bo.BeverageId });

			modelBuilder.Entity<User>()
						.HasIndex(u => u.UserName)
						.IsUnique();
		}
		public DbSet<User> Users { get; set; }

		public DbSet<Beverage> Beverages { get; set; }

		public DbSet<Order> Orders { get; set; }

		public DbSet<SingleBeverageTypeOrder> BeverageOrders { get; set; }
	}
}
