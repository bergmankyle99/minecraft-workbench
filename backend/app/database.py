from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv
load_dotenv()
#get database url from .env
DATABASE_URL = os.getenv("DATABASE_URL")
#create postgresql engine using the database URL, manages connections to postgresql database
engine = create_engine(DATABASE_URL)
#create local session factory via session maker, no auto commit, no autoflush, and bind the session to the engine
SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)
#create Base model that all sqlalchemy orm models will inherit from
Base = declarative_base()