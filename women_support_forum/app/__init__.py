from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import requests
from datetime import datetime, timedelta
from flask_apscheduler import APScheduler
import os
naming_convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(column_0_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}
db = SQLAlchemy()
jwt = JWTManager()
login_manager = LoginManager()
migrate = Migrate()  # Initialize Flask-Migrate
scheduler = APScheduler()

from .models import NewsArticle
from .models import Post, Comment
def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    
    # Check if we're in production mode
    if app.config.get('ENV') == 'production' or not app.config.get('DEBUG', False):
        app.config.update(
            SESSION_COOKIE_SECURE=True,
            SESSION_COOKIE_HTTPONLY=True,
            SESSION_COOKIE_SAMESITE='Lax',
        )
    else:
        app.config['DEVELOPMENT'] = True
        app.config['DEBUG'] = True

    # Register blueprints
    from .routes import  main as main_blueprint
    app.register_blueprint(main_blueprint)
    CORS(app)  # Enable CORS
    

        
    # Set up a scheduler to fetch news every 30 minutes
    scheduler.init_app(app)
    scheduler.start()
    add_scheduler_jobs()
    return app

API_KEY = os.environ.get('API_KEY')
API_URL = "https://api.currentsapi.services/v1/search"
FETCH_INTERVAL = 30


from sqlalchemy import and_

def delete_old_posts_and_comments():
    with scheduler.app.app_context():
        cutoff_time = datetime.utcnow() - timedelta(hours=72)
        
        # Delete old comments
        Comment.query.filter(Comment.timestamp < cutoff_time).delete(synchronize_session=False)
        
        # Delete old posts (this will also delete associated comments due to cascade)
        Post.query.filter(Post.timestamp < cutoff_time).delete(synchronize_session=False)
        
        db.session.commit()
    print("Old posts and comments deleted successfully.")


def fetch_and_store_news():
    keywords = ['women', 'gender equality', 'women\'s rights', 'femicide']
    all_articles = []

    for keyword in keywords:
        url = f"https://api.currentsapi.services/v1/search?apiKey=G5PJv04JeTT1GJYLVEuPmnWqDU5i62qmZVojzQ_coFF7EzRg&keywords={keyword}&language=en"
        response = requests.get(url)
        if response.status_code == 200:
            news_data = response.json().get('news', [])
            all_articles.extend(news_data)
        else:
            print(f"Error fetching news for keyword {keyword}: {response.status_code}")

    with scheduler.app.app_context():
        for article in all_articles:
            if not NewsArticle.query.filter_by(url=article['url']).first():
                published_str = article['published'][:-5].strip()
                
                try:
                    published_at = datetime.strptime(published_str, "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    print(f"Error parsing date for article: {article['url']}")
                    continue

                new_article = NewsArticle(
                    title=article['title'],
                    description=article['description'],
                    url=article['url'],
                    image=article['image'],
                    published_at=None
                )
                db.session.add(new_article)
                
                # Check if we have more than 50 articles
                article_count = NewsArticle.query.count()
                if article_count >= 50:
                    # Get the oldest article and delete it
                    oldest_article = NewsArticle.query.order_by(NewsArticle.published_at).first()
                    db.session.delete(oldest_article)

        db.session.commit()

    # After adding new articles, ensure we have at most 50
    with scheduler.app.app_context():
        while NewsArticle.query.count() > 50:
            oldest_article = NewsArticle.query.order_by(NewsArticle.published_at).first()
            db.session.delete(oldest_article)
        db.session.commit()
    return "News fetched and stored successfully"

def add_scheduler_jobs():
    # Schedule the job to run every 30 minutes
    scheduler.add_job(func=fetch_and_store_news, trigger='interval', minutes=40, id='news_job', replace_existing=True)
    scheduler.add_job(func=delete_old_posts_and_comments, trigger='interval', hours=1, id='delete_old_content_job', replace_existing=True)

