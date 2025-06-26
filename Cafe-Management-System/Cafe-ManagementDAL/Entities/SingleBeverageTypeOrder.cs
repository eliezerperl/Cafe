using Cafe_ManagementDAL.Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Entities {
	public class SingleBeverageTypeOrder : IEntity {
		public Guid OrderId { get; set; }

		public Order Order { get; set; }

		public Guid BeverageId { get; set; }
		public Beverage Beverage { get; set; }

		public int Quantity { get; set; }

		//[NotMapped]
		//public decimal Subtotal => Quantity * (Beverage?.Price ?? 0);
	}
}
