from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
import io
import re  # Import regex module to extract data
import base64  # Import base64 for encoding

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

def extract_food_details(response_text):
    """
    Extract Dish Name and Total Calories from the AI response using regex.
    """
    try:
        dish_name_pattern = re.search(r"Dish_Name:\s*(.+)", response_text)
        total_calories_pattern = re.search(r"Total_Calories:\s*([0-9]+)", response_text)

        dish_name = dish_name_pattern.group(1).strip() if dish_name_pattern else "Unknown"
        total_calories = int(total_calories_pattern.group(1)) if total_calories_pattern else 0

        return dish_name, total_calories
    except Exception as e:
        print(f"Error extracting details: {str(e)}")
        return "Unknown", 0

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file uploaded"}), 400

        image_file = request.files['image']
        if not image_file.content_type.startswith('image/'):
            return jsonify({"error": "Invalid file type. Please upload an image."}), 400

        # Read image and encode it as base64
        image_bytes = image_file.read()
        encoded_image = base64.b64encode(image_bytes).decode('utf-8')

        # Create the Gemini-compatible image object
        image_data = {
            "mime_type": image_file.content_type,
            "data": encoded_image
        }

        prompt = """
        Analyze this food image and provide:
        1. Identify the overall dish name (e.g., "Burger", "Veg Pizza", "Chicken Curry").
        2. List of identified food ingredients with quantity estimates and calorie counts.
        3. Total calorie range.

        STRICT RESPONSE FORMAT:
        Dish_Name: [Overall Dish Name]
        1. [Food Item] - [Quantity] - [Calories]
        2. [Food Item] - [Quantity] - [Calories]
        ...
        Total_Calories: Total X
        """

        response_text = get_gemini_response(prompt, image_data)

        if not response_text:
            return jsonify({"error": "Failed to analyze image"}), 500

        dish_name, total_calories = extract_food_details(response_text)

        return jsonify({
            "dish_name": dish_name,
            "total_calories": total_calories,
            "raw_analysis": response_text,
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
