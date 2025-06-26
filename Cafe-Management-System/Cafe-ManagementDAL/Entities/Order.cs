using Cafe_ManagementDAL.Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Entities {
	public class Order : IEntity {

		[Key]
		public Guid Id { get; set; } = Guid.NewGuid();

		public DateTime OrderDate { get; set; } = DateTime.Now;

		public string CustomerName { get; set; }

		public ICollection<SingleBeverageTypeOrder> BeverageOrders { get; set; } = [];

		public int TotalAmount { get; set; }

		public Guid UserId { get; set; }
		public User User { get; set; }

	}
}
