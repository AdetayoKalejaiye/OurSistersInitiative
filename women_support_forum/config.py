import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(BASE_DIR, 'instance', 'forum.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    

    WEBZ_IO_API_KEY = os.getenv('WEBZ_IO_API_KEY')

    
    # Secret keys
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-secret-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'default-jwt-secret-key'
    
    # JWT configuration
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    
    
    # Debug mode
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() in ['true', '1', 't']
