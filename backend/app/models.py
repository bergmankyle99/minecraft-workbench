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

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)

    searches = relationship(
        "StructureSearch",
        back_populates="user",
        cascade="all, delete"
    )

#create structure search model for all structure searches, includes relationships with users table and structure table
class StructureSearch(Base):
    __tablename__ = "structure_search"

    id = Column(Integer, primary_key=True, index=True)
    seed = Column(BigInteger)
    structure = Column(String)
    limit = Column(Integer)
    dimension = Column(Integer)

    datesearched = Column(DateTime, server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship(
        "Users",
        back_populates="searches"
    )

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

    search_id = Column(Integer, ForeignKey("structure_search.id"))

    search = relationship(
        "StructureSearch",
        back_populates="structures"
    )