
# Postman Assistant – Smart Contact Management System

Postman Assistant is an open-source contact management system designed for field workers, couriers, and delivery personnel who need quick access to addresses without memorization. It allows users to search for names, emails, or phone numbers instantly while keeping records organized.

This is a project for collecting personal data. For sensitive data, there is a password, and it is encrypted in storage and decrypted on the fly.The current password is `alshoja`. when u want to open in front end on form 

This is a hobby project I created during my relocation to Berlin from India using Vue 3, Vuetify, and NestJS.
The main use of this app will be aimed at POSTMAN in India, allowing them to store information about their area. It serves as a record-keeping tool for each person they interact with, functioning as an India Post record collector.

## 🔥 Key Features:
- 🔍 **Smart Search** – Find contacts easily using names, emails, or phone numbers.
- 📌 **Location-Aware** – Store and retrieve address data with geo-tagging.
- 📊 **Data Export/Import** – Easily transfer records in multiple formats (CSV, JSON, Excel). [PR WELCOMED]
- 🔐 **Secure & Scalable** – Role-based access and cloud-ready. [PR WELCOMED]

## 💡 Contribute Today
Help improve address management for field workers! If you're interested in contributing, feel free to fork this repo and submit your pull requests.


![Screenshot from 2025-01-30 20-55-09](https://github.com/user-attachments/assets/6df7fc33-0d4c-4753-a637-4a1124997674)

![Screenshot from 2025-01-30 20-54-24](https://github.com/user-attachments/assets/46d8a67a-ff77-4cfc-b7a9-2c0ac4fe2a8a)

![Screenshot from 2025-01-30 20-54-20](https://github.com/user-attachments/assets/deff9a56-4c98-4587-aa53-6a934794eb20)



## Prerequisites
Make sure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/posta-cloud.git
cd posta-cloud
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory and define the necessary environment variables:
```sh
POSTGRESQL_PORT=5432
POSTGRESQL_DATABASE=your_database
POSTGRESQL_USERNAME=your_user
POSTGRESQL_PASSWORD=your_password
VITE_API_URL=http://localhost:5000
VITE_ASSET_URL=http://localhost:3000
NODE_ENV=development
DB_HOST=posta_cloud_db
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
PORT=5000
```

### 3. Start the Application
Run the following command to start all services:
```sh
docker-compose up --build
```
This will:
- Start a PostgreSQL database container (`posta_cloud_db`)
- Start the backend service (`posta-cloud-be`)
- Start the frontend service (`posta-cloud-fe`)

### 4. Access the Application
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

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
docker-compose down
```

## Logs and Debugging
To view logs for a specific service, use:
```sh
docker-compose logs -f <service_name>
```
Example:
```sh
docker-compose logs -f backend
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


# Docker
docker-compose.override.yml
```

## Contributing
Pull Requests (PRs) are welcomed.

## License
This project is licensed under the MIT License.

