from datetime import timedelta, datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from app.database import SessionLocal
from app.models import Users
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
load_dotenv()

# Get Secret key from .env file
SECRET_KEY = os.getenv("SECRET_KEY")
# Get algorithm from .env file
ALGORITHM = os.getenv("ALGORITHM")

# Create router called "auth"
router = APIRouter(
    prefix='/auth',
    tags=['auth'
    ]
)

#Create Encryption method
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
#Create OAuth2 bearer for our token
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')


#Model for user Request
class CreateUserRequest(BaseModel):
    username: str
    password: str

#model for our token
class Token(BaseModel):
    access_token: str
    token_type: str

#get the db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Create db_dependency to connect to session
db_dependency = Annotated[Session, Depends(get_db)]

#create user route at /auth/, uses Users model to create a user and commit it to the database
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    create_user_model = Users(username=create_user_request.username, hashed_password=bcrypt_context.hash(create_user_request.password))
    db.add(create_user_model)
    db.commit()

#create user route at /auth/token to authenticate the user and get the token if successful, return token and type
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db:db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Couldnt validate user")
    token = create_access_token(user.username, user.id, timedelta(minutes=20))
    return {'access_token': token, 'token_type': 'bearer'}

# function verify the token, decode the token with the secret key and algorithm, get the user from sub and return user payload with username and id
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code = 403, detail="token invalid or expired")
        return payload
    except JWTError:
        raise HTTPException(status_code = 403, detail="token invalid or expired")

#Create route to verify token via an api call, calls verify token above
@router.get("/verify-token/{token}")
async def verify_user_token(token: str):
    verify_token(token)
    return {"message": "token is valid"}

#function to authenticate user from the database, checks user and password, uses bcrypt context to hash the passed in password and compare
def authenticate_user(username: str, password: str, db):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user

#function to create the access token using encode by adding sub, id, expires in the jwt
def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id}
    expires = datetime.now() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

#function to get the current user, decode the token, secret key and algorithm to get payload (username and id), if correct return username and password
async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
        return {'username':username, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')

#search database for the user based on the username and return the first instance of that user if available
def get_user_by_username(db: Session, username: str):
    return db.query(Users).filter(Users.username == username).first()