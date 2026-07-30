from fastapi import FastAPI, status, Depends, HTTPException
from app.database import engine, SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from app import models
from app import auth
from app.auth import get_current_user
from fastapi.middleware.cors import CORSMiddleware
from cubiomespi import Generator, MCVersion, Dimension, BiomeID, Structure, get_biome_at
from pydantic import BaseModel

#fastapi initialization and entry point, fastapi instance
app = FastAPI()

#add cors middleware to allow connecting to api via frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://minecraftworkbench.ca",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#include the auth route in main, allows for authentication routes in fastapi app
app.include_router(auth.router)
#create tables from sqlalchemy models if they dont exist
models.Base.metadata.create_all(bind = engine)

#get the database session, db dependency depends on this to run
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
#uses get_db and session type to create connection in db_dependency
db_dependency = Annotated[Session, Depends(get_db)]

#create user dependency of the current user of type dict
user_dependency = Annotated[dict, Depends(get_current_user)]
@app.get("/", status_code = status.HTTP_200_OK)
async def user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Auth Failed")
    return {"User": user}

#Create sqlalchemy model for submitting to database
class StructureRequest(BaseModel):
    seed: int
    structure: str
    limit: int
    dimension: int

#structure finder route for finding structures in a given seed, area, and dimension
@app.post("/structure-finder")
async def structure_finder(db: db_dependency, request: StructureRequest, user: user_dependency):

    #searched structure creates database entry from api call
    searched_structure = models.StructureSearch(
        seed=request.seed,
        structure=request.structure,
        limit=request.limit,
        dimension=request.dimension,
        user_id=user["id"]
    )
    #database insert
    db.add(searched_structure)
    #database commit
    db.commit()
    #refresh database
    db.refresh(searched_structure)

    #cubiomespi generator creator, this is what generates the world to be searched
    generator = Generator(
        MCVersion.MC_1_21,
        request.seed,
        request.dimension
    )
    #search for structures using generator and find closest structure, closest to zero zero
    closest_structure = generator.find_closest_structure(
        parseStructure(request.structure),
        0,
        0,
        request.limit
    )

    #put the found structure in a database model to be submitted
    found_structure = models.Structure(
        structureType=request.structure,
        x=closest_structure[0],
        z=closest_structure[1],
        search_id= searched_structure.id
    )
    #submit to database (insert)
    db.add(found_structure)
    #commit to database
    db.commit()
    #refresh and update database
    db.refresh(found_structure)

    #return structure found to frontend
    return {
        "structures": [
        {
            "structureType": request.structure,
            "x": closest_structure[0],
            "z": closest_structure[1]
        }
    ]
    }

#parse structures based on their str value and return their enum
def parseStructure(structureStr: str):
    match structureStr:
        case "Feature":
            return Structure.Feature[0]
        case "Desert Pyramid":
            return Structure.Desert_Pyramid[0]
        case "Jungle Temple" | "Jungle Pyramid":
            return Structure.Jungle_Temple[0]
        case "Swamp Hut":
            return Structure.Swamp_Hut[0]
        case "Igloo":
            return Structure.Igloo[0]
        case "Village":
            return Structure.Village[0]
        case "Ocean Ruin":
            return Structure.Ocean_Ruin[0]
        case "Shipwreck":
            return Structure.Shipwreck[0]
        case "Monument":
            return Structure.Monument[0]
        case "Mansion":
            return Structure.Mansion[0]
        case "Outpost":
            return Structure.Outpost[0]
        case "Ruined Portal":
            return Structure.Ruined_Portal[0]
        case "Ruined Portal N":
            return Structure.Ruined_Portal_N[0]
        case "Ancient City":
            return Structure.Ancient_City[0]
        case "Treasure":
            return Structure.Treasure[0]
        case "Mineshaft":
            return Structure.Mineshaft[0]
        case "Desert Well":
            return Structure.Desert_Well[0]
        case "Geode":
            return Structure.Geode[0]
        case "Fortress":
            return Structure.Fortress[0]
        case "Bastion":
            return Structure.Bastion[0]
        case "End City":
            return Structure.End_City[0]
        case "End Gateway":
            return Structure.End_Gateway[0]
        case "End Island":
            return Structure.End_Island[0]
        case "Trail Ruin":
            return Structure.Trail_Ruin[0]
        case "Trial Chambers":
            return Structure.Trial_Chambers[0]
        case _:
            raise ValueError(f"Unknown structure: {structureStr}")

#search through the structures and structure_search databases to find a history of searches for the current user
@app.get("/search-history")
async def get_search_history(db: db_dependency, user: user_dependency):

    #find searches from search structure where user_id = the users id, order them newest to oldest, and get all
    searches = db.query(models.StructureSearch)\
        .filter(
            models.StructureSearch.user_id == user["id"]
        ).order_by(models.StructureSearch.id.desc()).all()

    results = []

    #from the result of the db query, get each search result and append each structure found for each search
    # to the list of structures for that search (only one for now), then append that with the seed, type (again), 
    # and dimension to generate the full data information list for that search
    for search in searches:

        structure_list = []

        for structure in search.structures:
            structure_list.append({
                "structureType": structure.structureType,
                "x": structure.x,
                "z": structure.z
            })

        results.append({
            "id": search.id,
            "seed": search.seed,
            "structureType": search.structure,
            "dimension": search.dimension,
            "structures": structure_list
        })

    return results


#each biome search request will contain the seed, x, z, radius, and the version (to be used later)
class BiomeSearchRequest(BaseModel):
    seed: int
    x: int = 0
    z: int = 0
    radius: int = 1000
    version: int = 3100  # change to your Minecraft version


#convert biome ID to its string alternative for returning
def biome_to_string(biome_id):
    return f"minecraft:{BiomeID(biome_id).name.lower()}"


#find biomes in a search area from spawn
@app.post("/biome-finder1")
def find_biomes(request: BiomeSearchRequest):
    print(list(BiomeID))
    #generate terrain based on version seed, and dimension (in our case the dimension is just overworld)
    generator = Generator(
        MCVersion.MC_1_21,
        request.seed,
        0
    )

    #hold found biomes in dict
    found = {}

    #step this many blocks searching for biome so were not searching 1000x1000 times (millions)
    step = 8

    # find biome at x (bx) by searching from our starting point in our radius and stepping accordingly
    # example: X = 0 would search -1000 and +1000 stepping at intervals of 8 to find biomes, do this first
    for bx in range(
        request.x - request.radius,
        request.x + request.radius,
        step
    ):
        #then for each iteration (move in the x direction), search all z coordinate spots the same way, steps of 8
        # so for every X step, we search 1000 in z negative and 1000 in z positive
        for bz in range(
            request.z - request.radius,
            request.z + request.radius,
            step
        ):
            #do the actual search, with our generator, search biome at x, y=63 (surface), and biome at z
            biome = get_biome_at(
                generator,
                bx,
                63,
                bz
            )
            #try to convert the biome to a string, if it fails continue to next iteration
            try:
                biome_name =  biome_to_string(biome)
            except ValueError:
                continue

            # #if that biome hasnt been found yet, add an empty location in our found dict
            if biome_name not in found:
                found[biome_name] = []

            # append all biome locations at location corresponding to biome name
            found[biome_name].append({
                "x": bx,
                "z": bz
            })


    # Calculate center location of each biome
    biomes = []
    #for each biome and its location in found
    for biome_name, locations in found.items():

        #find center of biome instead of closest part to the starting x z
        center_x = sum(loc["x"] for loc in locations) / len(locations)
        center_z = sum(loc["z"] for loc in locations) / len(locations)

        biomes.append({
            "biome": biome_name,
            "x": round(center_x),
            "z": round(center_z),
            "samples": len(locations)
        })

    #for the search return the seed and list of biomes
    return {
        "seed": request.seed,
        "biomes": biomes
    }

