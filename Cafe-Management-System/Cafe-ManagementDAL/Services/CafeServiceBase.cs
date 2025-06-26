using Cafe_ManagementDAL.Data;
using Cafe_ManagementDAL.Entities.Interfaces;
using Cafe_ManagementDAL.Services.Intefaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cafe_ManagementDAL.Services {
	public class CafeServiceBase<T> : ICafeServiceBase<T> where T : class, IEntity {

		protected readonly CafeContext _dbContext;
		protected readonly DbSet<T> _dbSet;

		public CafeServiceBase(CafeContext context) {
			_dbContext = context;
			_dbSet = _dbContext.Set<T>();
		}


		public async Task CreateAsync(T entity) {
			_dbSet.Add(entity);
			await _dbContext.SaveChangesAsync();
		}

		public async Task DeleteAsync(Guid id) {
			var deletingEntity = await _dbSet.FindAsync(id);
			if (deletingEntity == null)
				throw new ArgumentException($"Entity with ID {id} does not exist.");

			_dbSet.Remove(deletingEntity);
			await _dbContext.SaveChangesAsync();
		}

		public async Task<IEnumerable<T>> GetAllAsync() {
			var listOfEntites = await _dbSet.ToListAsync();

			return listOfEntites;
		}

		public async Task<T> GetByIdAsync(Guid id) {
			var wantedEntity = await _dbSet.FindAsync(id);
			if (wantedEntity == null)
				throw new ArgumentException($"Entity with ID {id} does not exist.");

			return wantedEntity;
		}

		public async Task UpdateAsync(Guid id, T entity) {
			var existingEntity = await _dbSet.FindAsync(id);
			if (existingEntity == null)
				throw new ArgumentException($"Entity with ID {id} does not exist.");

			_dbContext.Entry(existingEntity).CurrentValues.SetValues(entity);

			await _dbContext.SaveChangesAsync();
		}
	}
}
