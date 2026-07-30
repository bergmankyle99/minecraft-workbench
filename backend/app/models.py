from sqlalchemy import (
    Column,
    Integer,
    BigInteger,
    String,
    ForeignKey,
    DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

#create user model and relationships for users table, connected to searches 
class Users(Base):
    __tablename__ = "users"
    #create ID as primary key and index
    id = Column(Integer, primary_key=True, index=True)
    #create username, must be unique
    username = Column(String, unique=True)
    #hashed password of string
    hashed_password = Column(String)
    #create relationship with searches table
    searches = relationship(
        "StructureSearch",
        back_populates="user",
        cascade="all, delete"
    )

#create structure search model for all structure searches, includes relationships with users table and structure table
class StructureSearch(Base):
    __tablename__ = "structure_search"
    # id with primary key, and index
    id = Column(Integer, primary_key=True, index=True)
    #seed as a big integer
    seed = Column(BigInteger)
    #structure as string
    structure = Column(String)
    #limit (range) as integer
    limit = Column(Integer)
    #dimension as integer (-1, 0, 1)
    dimension = Column(Integer)

    #datesearched, auto filled with .now()
    datesearched = Column(DateTime, server_default=func.now())

    #create foreign key with a the users table user id
    user_id = Column(Integer, ForeignKey("users.id"))

    #create relationship with users table
    user = relationship(
        "Users",
        back_populates="searches"
    )

    #create realtionship with structures table
    structures = relationship(
        "Structure",
        back_populates="search",
        cascade="all, delete"
    )

#create structure model for database, connected to search structured search table
class Structure(Base):
    __tablename__ = "structure"

    id = Column(Integer, primary_key=True, index=True)
    structureType = Column(String)
    x = Column(Integer)
    z = Column(Integer)

    #create foreign key with structure_search table's search id
    search_id = Column(Integer, ForeignKey("structure_search.id"))

    # create relationship with structure search table
    search = relationship(
        "StructureSearch",
        back_populates="structures"
    )