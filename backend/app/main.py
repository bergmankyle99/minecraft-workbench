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
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
models.Base.metadata.create_all(bind = engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
@app.get("/", status_code = status.HTTP_200_OK)
async def user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Auth Failed")
    return {"User": user}




class StructureRequest(BaseModel):
    seed: int
    structure: str
    limit: int
    dimension: int

# class StructureSearchRequest(BaseModel):
#     seed: int
#     structure: str
#     limit: int
#     dimension: int
#     user_id: int

# class StructureSearchResults(BaseModel):
#     structureType: str
#     x: int
#     z: int

@app.post("/structure-finder")
async def structure_finder(db: db_dependency, request: StructureRequest, user: user_dependency):

    searched_structure = models.StructureSearch(
        seed=request.seed,
        structure=request.structure,
        limit=request.limit,
        dimension=request.dimension,
        user_id=user["id"]
    )
    db.add(searched_structure)
    db.commit()
    db.refresh(searched_structure)

    generator = Generator(
        MCVersion.MC_1_21,
        request.seed,
        request.dimension
    )
    closest_structure = generator.find_closest_structure(
        parseStructure(request.structure),
        0,
        0,
        request.limit
    )

    found_structure = models.Structure(
        structureType=request.structure,
        x=closest_structure[0],
        z=closest_structure[1],
        search_id= searched_structure.id
    )
    db.add(found_structure)
    db.commit()
    db.refresh(found_structure)

    return {
        "structures": [
        {
            "structureType": request.structure,
            "x": closest_structure[0],
            "z": closest_structure[1]
        }
    ]
    }


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