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

        prompt = input_prompt = """
Analyze this food image and provide:
1. Identify the overall dish name (e.g., "Burger", "Veg Pizza", "Chicken Curry").
2. List of identified food ingredients with quantity estimates and calorie counts.
3. Total calorie range.

STRICT RESPONSE FORMAT:
Dish Name: [Overall Dish Name]
1. [Food Item] - [Quantity] - [Calories]
2. [Food Item] - [Quantity] - [Calories]
...
Total Calories: Total X

RULES:
- Identify food with specific names (e.g., "Veg Pizza", "Schezwan Noodles")
- Estimate quantity in grams or common units (e.g., "1 slice", "200g")
- Calories must be whole numbers per item
- Sort items by calorie contribution (highest first)
- Include cooking fats/oils as separate items
- Maximum 8 food items
- Never mention uncertainty or analysis methods
- No additional text outside the format
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
  app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
