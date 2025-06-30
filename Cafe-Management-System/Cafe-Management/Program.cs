using Cafe_Management;
using Cafe_ManagementDAL;
using Cafe_ManagementDAL.Data;
using Cafe_ManagementDAL.Entities;
using Cafe_ManagementDAL.Enums;
using Cafe_ManagementDAL.Services;
using Cafe_ManagementDAL.Services.Intefaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

//CORS
builder.Services.AddCors(options =>
{
	options.AddPolicy("AngularApp",
		builder => builder
			.WithOrigins("http://localhost:4200")
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials()  // optional, only if you're using cookies/auth
	);
});

//Services
builder.Services.AddControllers()
	.AddJsonOptions(options => {
		options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
		options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
	});
builder.Services.AddDbContext<CafeContext>(options =>
		options.UseSqlServer(builder.Configuration.GetConnectionString("CafeManagementDb")
		));

//builder.Services.AddIdentity<User, IdentityRole>();

builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IBeverageService, BeverageService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddAuthentication(
	JwtBearerDefaults.AuthenticationScheme
).AddJwtBearer(x =>
{
	x.TokenValidationParameters = new TokenValidationParameters
	{
		ValidIssuer = JwtOptions.Issuer,
		ValidAudience = JwtOptions.Audience,
		IssuerSigningKey = new SymmetricSecurityKey
			(Encoding.UTF8.GetBytes(JwtOptions.Key)),
		ValidateIssuer = true,
		ValidateAudience = true,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
	};
	x.Events = new JwtBearerEvents
	{
		OnMessageReceived = context =>
		{
			// Getting the token from the cookie and set it in the Authorization header
			string token = context.Request.Cookies["jwtToken"];
			if (!string.IsNullOrEmpty(token))
			{
				context.Token = token;
			}
			return Task.CompletedTask;
		},
		OnTokenValidated = context =>
		{
			// Checking the token's expiration time
			var token = (context.SecurityToken as JwtSecurityToken);
			if (token != null && token.ValidTo < DateTime.UtcNow)
			{
				context.Fail("Token has expired.");
			}
			return Task.CompletedTask;
		},
		OnForbidden = context =>
		{
			Console.WriteLine("🔒 Forbidden request");
			foreach (var claim in context.HttpContext.User.Claims) {
				Console.WriteLine($"Claim: {claim.Type} = {claim.Value}");
			}
			return Task.CompletedTask;
		}
	};
});

//builder.Services.AddAuthorization();
builder.Services.AddAuthorization(options => {
	options.AddPolicy("AuthenticatedOnly", policy =>
		policy.RequireAuthenticatedUser());

	options.AddPolicy("AdminOrOwner", policy =>
		policy.RequireRole("ADMIN", "OWNER"));

	options.AddPolicy("OwnerOnly", policy =>
		policy.RequireRole("OWNER"));
});

// For swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

//await using (var scope = app.Services.CreateAsyncScope()) { //to use if not using update-database with migrations
//	using var context = scope.ServiceProvider.GetService<CafeContext>();
//	await context.Database.EnsureCreatedAsync();
//}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseCors("AngularApp");

//To use JWT auth that we added
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
