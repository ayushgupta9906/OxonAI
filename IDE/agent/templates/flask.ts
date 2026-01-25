// Python Flask Template
module.exports = {
    name: 'Python Flask API',
    description: 'RESTful API with Python Flask',
    icon: '🐍',
    language: 'python',

    files: {
        'app.py': `from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to Flask API',
        'version': '1.0.0'
    })

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/data', methods=['GET', 'POST'])
def data():
    if request.method == 'POST':
        data = request.get_json()
        return jsonify({
            'message': 'Data received',
            'data': data
        }), 201
    else:
        return jsonify({
            'items': [
                {'id': 1, 'name': 'Item 1'},
                {'id': 2, 'name': 'Item 2'}
            ]
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000)`,

        'requirements.txt': `Flask==3.0.0
flask-cors==4.0.0
python-dotenv==1.0.0`,

        '.env.example': `FLASK_ENV=development
FLASK_APP=app.py
PORT=5000`,

        '.gitignore': `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/

# Flask
instance/
.webassets-cache

# Environment
.env

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store`,

        'README.md': `# Flask API

RESTful API built with Python Flask.

## Getting Started

\`\`\`bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Run the app
python app.py
\`\`\`

The API will be available at \`http://localhost:5000\`

## Endpoints

- \`GET /\` - Welcome message
- \`GET /api/health\` - Health check
- \`GET /api/data\` - Get data
- \`POST /api/data\` - Create data`
    }
};
