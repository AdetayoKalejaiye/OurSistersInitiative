from app import create_app, db
from flask_cors import CORS
import os
app = create_app()

instance_path = os.path.join(app.config['BASE_DIR'], 'instance')
if not os.path.exists(instance_path):
    os.makedirs(instance_path)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
