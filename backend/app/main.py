from fastapi import FastAPI, status, Depends, HTTPException
from app.database import engine, SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from app import models
from app import auth
from app.auth import get_current_user
from fastapi.middleware.cors import CORSMiddleware
from cubiomespi import Generator, MCVersion, Dimension, BiomeID, Structure
from pydantic import BaseModel

#fastapi initialization and entry point
app = FastAPI()

#add cors middleware to allow connecting to api via frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#include the auth route in main
app.include_router(auth.router)
#bind tables to the docker container and create tables from models
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