from flask import Blueprint, jsonify, request, current_app
from app.models import User, Post, Comment, NewsArticle
from app import db, create_app
from app.models import Comment


main = Blueprint('main', __name__)

from flask import jsonify, redirect, url_for
from flask_jwt_extended import verify_jwt_in_request, get_jwt, create_refresh_token, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
import requests
from dotenv import load_dotenv
WEBZ_IO_API_KEY = os.getenv('WEBZ_IO_API_KEY')
load_dotenv()

    

@main.route('/api/search', methods=['GET'])
def search_posts():
    query = request.args.get('q', '')
    posts = Post.query.filter(
        (Post.title.ilike(f'%{query}%')) | 
        (Post.content.ilike(f'%{query}%'))
    ).all()
    return jsonify([{
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'author': post.author.username,
        'timestamp': post.timestamp,
        'category': post.category
    } for post in posts])


# Endpoint to get comments for a specific post
@main.route('/api/posts/<int:post_id>/comments', methods=['GET', 'POST'])
def comments(post_id):
    if request.method == "GET":
        comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.timestamp.asc()).all()
        return jsonify([{
            'id': comment.id,
            'content': comment.content,
            'author': comment.user.username,
            'timestamp': comment.timestamp
        } for comment in comments])
    
    elif request.method == "POST":
        @jwt_required()
        def add_comment():
            data = request.get_json()
            content = data.get('content')
            user_id = get_jwt_identity()
            if not content:
                return jsonify({'error': 'Content is required.'}), 400
            post = Post.query.get_or_404(post_id)
            user = User.query.get_or_404(user_id)
            new_comment = Comment(content=content, user_id=user_id, post_id=post_id)
            db.session.add(new_comment)
            db.session.commit()

            return jsonify({'message': 'Comment added successfully.'}), 201
        return add_comment()





#Login logic
@main.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    
    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(minutes=15))
        refresh_token = create_refresh_token(identity=user.id, expires_delta=timedelta(hours = 2))
        return jsonify(access_token=access_token, refresh_token=refresh_token, user_id=user.id), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401

#Token refresh
@main.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id, fresh=False, expires_delta=timedelta(hours = 2))
    return jsonify(access_token=new_access_token), 200

#Sign Up logic
@main.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required.'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists.'}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=username)
    return jsonify({'message': 'User created successfully.', 'access_token': access_token}), 201




#Post Creation Logic
@main.route('/api/posts', methods=['GET', 'POST', 'OPTIONS'])
def posts():
    if request.method == 'OPTIONS':
        return '', 200
    
    if request.method == 'GET':
        posts = Post.query.order_by(Post.timestamp.desc()).all()
        posts_list = [{
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'author': post.author.username,
            'timestamp': post.timestamp,
            'category': post.category
        } for post in posts]
        return jsonify(posts_list), 200
    
    elif request.method == 'POST':
        @jwt_required()
        def create_post():
            data = request.get_json()
            title = data.get('title')
            content = data.get('content')
            category = data.get('category')
            
            current_user_id = get_jwt_identity()

            if not all([title, content, category]):
                return jsonify({'msg': 'Title, content, and category are required.'}), 422

            user = User.query.get(current_user_id)
            if not user:
                return jsonify({'msg': 'User not found.'}), 404

            new_post = Post(title=title, content=content, category=category, author=user)
            db.session.add(new_post)
            db.session.commit()

            return jsonify({
                'message': 'Post created successfully.',
                'post': {
                    'id': new_post.id,
                    'title': new_post.title,
                    'content': new_post.content,
                    'author': user.username,
                    'timestamp': new_post.timestamp,
                    'category': new_post.category
                }
            }), 201
        
        return create_post() 
    


@main.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    return jsonify({
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'author': post.author.username,
        'timestamp': post.timestamp,
        'category': post.category
    })




@main.route('/api/articles', methods=['GET'])
def search_news():
    query = request.args.get('q', '')
    # Fetch stored news from the database
    articles = NewsArticle.query.filter(NewsArticle.title.ilike(f'%{query}%')).order_by(NewsArticle.published_at.desc()).all()
    return jsonify([{
        'title': article.title,
        'description': article.description,
        'url': article.url,
        'image': article.image,
        'published_at': article.published_at
    } for article in articles])