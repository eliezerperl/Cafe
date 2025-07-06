using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cafe_ManagementDAL.Migrations
{
    /// <inheritdoc />
    public partial class addimagepath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Beverages",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Beverages");
        }
    }
}
