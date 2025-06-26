using Cafe_ManagementDAL.Data;
using Cafe_ManagementDAL.Entities;
using Cafe_ManagementDAL.Services.Intefaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Services {
	public class UserService : CafeServiceBase<User>, IUserService {
		public UserService(CafeContext context) : base(context) {
		}
	}
}
