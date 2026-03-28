### Getting Started
This is a project for collecting personal data. For sensitive data, there is a password, and it is encrypted in storage and decrypted on the fly.The current password is `alshoja`. when u want to open in front end on form 

This is a hobby project I created during my relocation to Berlin from India using Vue 3, Vuetify, and NestJS.
The main use of this app will be aimed at POSTMAN in India, allowing them to store information about their area. It serves as a record-keeping tool for each person they interact with, functioning as an India Post record collector.

## 🔥 Key Features:
- 🔍 **Smart Search** – Find contacts easily using names, emails, or phone numbers.
- 📌 **Location-Aware** – Store and retrieve address data with geo-tagging.
- 📊 **Data Export/Import** – Easily transfer records in multiple formats (CSV, JSON, Excel). [PR WELCOMED]
- 🔐 **Secure & Scalable** – Role-based access and cloud-ready. [PR WELCOMED]


![Screenshot from 2025-01-30 20-55-09](https://github.com/user-attachments/assets/6df7fc33-0d4c-4753-a637-4a1124997674)

![Screenshot from 2025-01-30 20-54-24](https://github.com/user-attachments/assets/46d8a67a-ff77-4cfc-b7a9-2c0ac4fe2a8a)

![Screenshot from 2025-01-30 20-54-20](https://github.com/user-attachments/assets/deff9a56-4c98-4587-aa53-6a934794eb20)



## Prerequisites
Make sure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)



### 1. Clone the Repository
```sh
git clone https://github.com/your-username/posta-cloud.git
cd posta-cloud
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory and define the necessary environment variables:
```sh
# App Specific
DB_HOST=postgres_db
DB_PORT=5432
DB_NAME=posta_cloud
DB_USER=posta_cloud_db
DB_PASSWORD=posta_cloud123
NODE_ENV=development
PORT=5000

# Docker Specific
POSTGRESQL_PORT=5432
POSTGRESQL_USERNAME=posta_cloud_db
POSTGRESQL_DATABASE=posta_cloud
POSTGRESQL_PASSWORD=posta_cloud123

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin123

# Frontend
VITE_API_URL=http://localhost:5000/api
VITE_ASSET_URL=http://localhost:5000
```

### 3. Start the Application
Run the following command to start all services fro windows use git bash as terminal to run this:
```sh
./setup.sh
 
```
This will:
- Start a PostgreSQL database container (`posta_cloud_db`)
- Start the backend service (`posta-cloud-be`)
- Start the frontend service (`posta-cloud-fe`)

### 4. Access the Application
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)
- pgAdmin: [http://localhost:8080](http://localhost:8080) (if u asked for password type ´posta_cloud123´)

  Default pgAdmin credentials:
  - Email: `admin@localhost`
  - Password: `admin123`

## Services
### PostgreSQL (`posta_cloud_db`)
- Uses the Bitnami PostgreSQL image.
- Stores persistent data in a Docker volume `db-data`.
- Initializes the database using scripts from `./database/` (if provided).

### Frontend (`posta-cloud-fe`)
- Built with Vue 3 and Vuetify.
- Runs in development mode with `npm run dev`.

### Backend (`posta-cloud-be`)
- A NestJS-based API service.
- Connects to the PostgreSQL database.
- Runs in development mode with `npm run start:dev`.

## Stopping the Application
To stop and remove the containers, run:
```sh
docker compose down
```

## Logs and Debugging
To view logs for a specific service, use:
```sh
docker compose logs -f <service_name>
```
Example:
```sh
docker compose logs -f backend
```

## Technologies Used
- Vue 3
- Vuetify
- Pinia
- NestJS
- PostgreSQL
- Docker
- Docker Compose

## Notes
- The database uses a volume (`db-data`) to persist data across restarts.
- Ensure that environment variables are correctly set in the `.env` file.

## 💡 Contribute Today
Help improve address management for field workers! If you're interested in contributing, feel free to fork this repo and submit your pull requests.

