# Cafe Ordering and Management App

A full-stack Cafe Management application with an **Angular** frontend and a **.NET Core Web API** backend using **MSSQL**.

Manage beverages, orders, users, and roles with a modern UI and robust backend services.

Live demo at https://eliezers-cafe-management.vercel.app (In Memory DB)
---

## Features

- Angular frontend with reactive forms and routing  
- .NET Core Web API backend with Entity Framework Core  
- MSSQL database integration  
- User authentication and role-based authorization  
- Loading indicators and idle timeout management  

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)  
- [Angular CLI](https://angular.io/cli)  
- [.NET SDK](https://dotnet.microsoft.com/download) (6.0 or later)  
- MSSQL Server (local or cloud)  

---

### Backend Setup (`Cafe-Management-System`)

1. Clone the repo and go to the backend folder:

   ```bash
   git clone https://github.com/eliezerperl/Cafe.git
   cd Cafe/Cafe-Management-System

2. Restore and build dependencies:

   ```bash
    dotnet restore
    dotnet build

3. Update the database connection string in appsettings.json.

4. Apply Entity Framework migrations to create/update the database:

   ```bash
    dotnet ef database update

5. Run the backend API:

   ```bash
    dotnet run


### Frontend Setup (`Cafe-Management-App`)


1. Navigate to the frontend folder:

   ```bash
    cd ../Cafe-Management-App

2. Install npm dependencies:

   ```bash
    npm install

3. Start the Angular development server:

   ```bash
    ng serve

4. Open your browser at:

   ```bash
    http://localhost:4200


## Usage

- Login with your credentials or create users via backend seed or DB.  
- Use the UI to manage beverages, orders, and users.  
- Admin users have extra permissions for management tasks.

