using Cafe_ManagementDAL.Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Services.Intefaces {
	public interface ICafeServiceBase<T> where T : class, IEntity {
		Task<IEnumerable<T>> GetAllAsync();

		Task<T> GetByIdAsync(Guid id);

		Task CreateAsync(T entity);

		Task UpdateAsync(Guid id, T entity);

		Task DeleteAsync(Guid id);
	}
}
