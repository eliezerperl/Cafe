using Cafe_ManagementDAL.Data;
using Cafe_ManagementDAL.Entities;
using Cafe_ManagementDAL.Services.Intefaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Services {
	public class BeverageService : CafeServiceBase<Beverage>, IBeverageService {
		public BeverageService(CafeContext context) : base(context) {
		}

	}
}
