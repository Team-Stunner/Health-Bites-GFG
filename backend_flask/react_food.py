from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
load_dotenv()  # Load environment variables

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def get_gemini_response(prompt, image_data):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content([prompt, image_data])
        return response.text
    except Exception as e:
        print(f"Error in Gemini API call: {str(e)}")
        return None

def process_image(image_file):
    try:
        image_bytes = image_file.read()
        encoded_image = base64.b64encode(image_bytes).decode('utf-8')
        return {
            "mime_type": image_file.content_type,
            "data": encoded_image
        }
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return None

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        if 'image' not in request.files:
            return jsonify({
                "error": "No image file uploaded"
            }), 400

        image_file = request.files['image']
        
        if not image_file.content_type.startswith('image/'):
            return jsonify({
                "error": "Invalid file type. Please upload an image."
            }), 400

        image_data = process_image(image_file)
        if not image_data:
            return jsonify({
                "error": "Failed to process image"
            }), 500

        prompt = """
        You are a nutrition expert. Analyze the food items in this image and provide:
        1. A detailed list of identified food items
        2. Estimated calories for each item
        3. Total calories
        4. Basic nutritional breakdown (protein, carbs, fat) if possible
        
        Format your response like this:
        Food Items:
        1. [Item Name] - [Calories] calories
        2. [Item Name] - [Calories] calories
        
        Total Calories: [Sum]
        
        Estimated Nutrients:
        - Protein: [X]g
        - Carbs: [X]g
        - Fat: [X]g
        """

        response_text = get_gemini_response(prompt, image_data)
        
        if not response_text:
            return jsonify({
                "error": "Failed to analyze image"
            }), 500

        return jsonify({
            "calorie_info": response_text,
            "success": True
        })

    except Exception as e:
        print(f"Error in analyze endpoint: {str(e)}")
        return jsonify({
            "error": "An unexpected error occurred",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)