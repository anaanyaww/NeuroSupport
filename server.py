from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST"]}})

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/test-connection', methods=['GET'])
def test_connection():
    return jsonify({"status": "Server is running"}), 200

def calculate_score(answers):
    try:
        logging.debug(f"Calculating score for answers: {answers}")
        score = 0
        for _, value in answers.items():
            if value == 'Definitely Agree':
                score += 4
            elif value == 'Slightly Agree':
                score += 3
            elif value == 'Slightly Disagree':
                score += 2
            else:
                score += 1

        status = "Non-Autistic" if score < (len(answers) * 2) else "Autistic Traits Detected"
        logging.debug(f"Score calculated: {score}, Status: {status}")
        return {"total": score, "status": status}
    except Exception as e:
        logging.error(f"Error in calculate_score: {str(e)}")
        raise

@app.route('/submit-test', methods=['POST'])
def submit_test():
    try:
        logging.info("Received test submission request")
        data = request.get_json()
        logging.debug(f"Received data: {data}")
        
        if not data:
            logging.error("No data received")
            return jsonify({"error": "No data received"}), 400
        
        score = calculate_score(data)
        logging.info(f"Test processed successfully: {score}")
        return jsonify(score), 200
    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Access the server at http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')