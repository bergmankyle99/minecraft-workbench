````md
# Minecraft Workbench

A full-stack Minecraft seed analysis and world exploration platform built to help players discover structures, biomes, and world information from Minecraft seeds.

Minecraft Workbench uses the **Cubiomes library through cubiomespi** to efficiently analyze Minecraft world generation, with a modern web stack consisting of **FastAPI, Next.js, PostgreSQL, Docker, and AWS deployment**.

---

# Features

## Structure Finder

Find Minecraft structures based on:

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

Results include:

- Structure type
- X/Z coordinates
- Search history

---

## Biome Finder

Analyze Minecraft world regions and discover nearby biomes.

Features:

- Search around custom X/Z coordinates
- Adjustable search radius
- Detect multiple biome types
- Return biome locations
- Count biome samples found

---

## User Authentication

Includes:

- User registration
- JWT authentication
- Protected API routes
- User-specific search history

---

## Search History

Users can view previous searches including:

- Seeds searched
- Structures found
- Coordinates
- Dimensions
- Search timestamps

---

# Tech Stack

## Frontend

### Next.js + React + TypeScript

Used for:

- User interface
- Form handling
- API communication
- Client-side interactions
- Responsive design

---

## Backend

### FastAPI (Python)

Used for:

- REST API development
- Authentication
- Minecraft world calculations
- Request validation
- Database communication

Libraries:

- FastAPI
- Pydantic
- SQLAlchemy
- Python-JOSE JWT
- Passlib

---

## Minecraft World Generation

### cubiomespi

Python bindings for the Cubiomes Minecraft world generation library.

Used for:

- Structure generation
- Biome lookup
- Seed analysis

Cubiomes allows Minecraft world information to be calculated without loading an actual Minecraft world.

---

## Database

### PostgreSQL

Stores:

- Users
- Structure searches
- Found structures
- Search history

ORM:

- SQLAlchemy

---

# Infrastructure

## Docker

The application is containerized using Docker Compose.

Services:

```
minecraft-frontend
    |
    Next.js application


minecraft-api
    |
    FastAPI backend


minecraft-postgres
    |
    PostgreSQL database
```

---

## AWS Deployment

Minecraft Workbench is deployed using AWS infrastructure.

Current deployment includes:

- AWS EC2
- Docker containers
- Nginx reverse proxy
- HTTPS with Certbot
- PostgreSQL database

---

# Architecture

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
               |           |
               |       cubiomespi
               |           |
               |    Minecraft Generation
               |
          PostgreSQL
```

---

# API Endpoints

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

# Running Locally

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

# Future Improvements

Planned features:

- Interactive Minecraft world map
- Structure and biome visualization
- Chunk-based map rendering
- Support for more Minecraft versions
- Improved biome searching algorithms
- Redis background workers
- AWS S3 storage for generated maps
- More advanced world analysis tools

---

# Project Goals

Minecraft Workbench was created to combine Minecraft world generation research with real-world software engineering practices.

The project demonstrates:

- Full-stack application development
- REST API design
- Database architecture
- Authentication systems
- Containerization
- Cloud deployment
- Working with computationally intensive libraries

Minecraft Workbench transforms Minecraft seed analysis into a modern web application.
````
