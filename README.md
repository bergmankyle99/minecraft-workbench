````md
<h1 align="center">
  🟩 Minecraft Workbench
</h1>

<p align="center">
  A full-stack Minecraft seed analysis and world exploration platform for discovering structures, biomes, and world information from Minecraft seeds.
</p>

<p align="center">
  Built with FastAPI, Next.js, PostgreSQL, Docker, AWS, and Cubiomes.
</p>

---

## 🚀 Overview

Minecraft Workbench is a full-stack web application that allows users to analyze Minecraft world generation using seeds.

The application uses **Cubiomes through cubiomespi** to calculate Minecraft structures and biome information without requiring a Minecraft world save file.

The goal of this project is to combine Minecraft world generation research with real-world software engineering practices, including:

- Full-stack development
- REST API design
- Database architecture
- Authentication systems
- Containerization
- Cloud deployment

---

# ✨ Features

## 🔎 Structure Finder

Search Minecraft worlds for structures using:

- World seed
- Structure type
- Dimension
- Search radius

Supported structures include:

- Villages
- Strongholds
- Ancient Cities
- Trial Chambers
- Ocean Monuments
- Shipwrecks
- Mansions
- Bastions
- End Cities
- And many more

Returns:

- Structure type
- X/Z coordinates
- Search history

---

## 🌎 Biome Finder

Analyze Minecraft terrain generation and discover nearby biomes.

Features:

- Search using custom X/Z coordinates
- Adjustable search radius
- Detect multiple biome types
- Return biome locations
- Track biome sample counts

---

## 🔐 Authentication

Minecraft Workbench includes a complete authentication system:

- User registration
- JWT authentication
- Protected API endpoints
- User-specific search history

---

## 📜 Search History

Users can view previous searches including:

- Seeds searched
- Structures found
- Coordinates
- Dimensions
- Search results

---

# 🛠 Technology Stack

## Frontend

### Next.js + React + TypeScript

Used for:

- User interface
- Client-side interactions
- Form handling
- API communication
- Responsive layouts

---

## Backend

### FastAPI + Python

Used for:

- REST API development
- Authentication
- Minecraft calculations
- Request validation
- Database communication

Libraries:

- FastAPI
- Pydantic
- SQLAlchemy
- Python-JOSE JWT
- Passlib

---

## Minecraft Generation

### cubiomespi

Python bindings for the Cubiomes Minecraft world generation library.

Used for:

- Structure generation
- Biome lookup
- Seed analysis

Cubiomes allows Minecraft world information to be calculated without loading a Minecraft save file.

---

## Database

### PostgreSQL

Stores:

- User accounts
- Structure searches
- Found structures
- Search history

ORM:

- SQLAlchemy

---

# 🏗 Architecture

```
                         User
                           |
                           |
              minecraftworkbench.ca
                           |
                        Nginx
                       /     \
                      /       \
                 Next.js     FastAPI
                    |            |
                    |        cubiomespi
                    |            |
                    |   Minecraft Generation
                    |
                PostgreSQL
```

---

# ☁️ Deployment

Minecraft Workbench is deployed using AWS infrastructure.

Current deployment includes:

- AWS EC2
- Docker containers
- Docker Compose
- Nginx reverse proxy
- HTTPS with Certbot
- PostgreSQL database

Application services:

```
minecraft-frontend
        |
        Next.js


minecraft-api
        |
        FastAPI


minecraft-postgres
        |
        PostgreSQL
```

---

# 🔌 API Overview

## Authentication

### Register

```
POST /auth/register
```

Creates a new user account.

---

### Login

```
POST /auth/token
```

Returns a JWT authentication token.

---

# Structure Finder

```
POST /structure-finder
```

Example request:

```json
{
  "seed": 12345,
  "structure": "Village",
  "limit": 1000,
  "dimension": 0
}
```

Example response:

```json
{
  "structures": [
    {
      "structureType": "Village",
      "x": 432,
      "z": -128
    }
  ]
}
```

---

# Biome Finder

```
POST /biome-finder
```

Example request:

```json
{
  "seed": 12345,
  "x": 0,
  "z": 0,
  "radius": 1000
}
```

Example response:

```json
{
  "seed": 12345,
  "biomes": [
    {
      "biome": "minecraft:plains",
      "x": 120,
      "z": -64,
      "samples": 500
    }
  ]
}
```

---

# Search History

```
GET /search-history
```

Returns previous searches for the authenticated user.

---

# 💻 Running Locally

## Requirements

Install:

- Docker
- Docker Compose
- Node.js
- Python 3.12+

---

## Clone Repository

```bash
git clone https://github.com/bergmankyle99/workbench.git

cd workbench
```

---

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@postgres:5432/workbench

SECRET_KEY=your_secret_key

ALGORITHM=HS256
```

---

## Start Application

Run:

```bash
docker compose up --build
```

Application URLs:

Frontend:

```
http://localhost:3000
```

Backend:

```
http://localhost:8000
```

FastAPI Documentation:

```
http://localhost:8000/docs
```

---

# 🔮 Future Improvements

Planned features:

- Interactive Minecraft world map
- Structure and biome visualization
- Chunk-based map rendering
- Support for additional Minecraft versions
- Redis background workers
- AWS S3 storage for generated maps
- More advanced world analysis tools

---

# 🎯 Project Purpose

Minecraft Workbench was created to explore Minecraft world generation while applying real-world software engineering concepts.

This project demonstrates experience with:

- Full-stack application development
- REST API architecture
- Database design
- Authentication systems
- Docker containerization
- Cloud deployment
- Computational libraries

Minecraft Workbench transforms Minecraft seed analysis into a modern web application.
````
