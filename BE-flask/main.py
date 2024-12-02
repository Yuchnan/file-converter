from flask import Flask, render_template, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
def test_get():
    return jsonify({'message': 'Test Flask', 'data': [1, 2, 3]})

if __name__ == '__main__':
    app.run(debug=True)
