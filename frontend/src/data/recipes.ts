import type { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Quinoa Buddha Bowl',
    description: 'A nutritious bowl packed with protein and vegetables',
    calories: 450,
    protein: 15,
    carbs: 65,
    fat: 12,
    prepTime: 25,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800',
    ingredients: [
      'Quinoa',
      'Sweet Potato',
      'Chickpeas',
      'Kale',
      'Avocado',
      'Tahini'
    ],
    tags: ['Vegetarian', 'High-Protein', 'Gluten-Free'],
    instructions: [
      'Cook quinoa according to package instructions',
      'Roast sweet potato and chickpeas',
      'Massage kale with olive oil',
      'Assemble bowl and top with tahini dressing'
    ]
  },
  {
    id: '2',
    name: 'Grilled Salmon with Asparagus',
    description: 'Omega-3 rich salmon with crispy asparagus',
    calories: 380,
    protein: 34,
    carbs: 12,
    fat: 22,
    prepTime: 20,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800',
    ingredients: [
      'Salmon fillet',
      'Asparagus',
      'Lemon',
      'Olive oil',
      'Garlic',
      'Herbs'
    ],
    tags: ['High-Protein', 'Low-Carb', 'Gluten-Free'],
    instructions: [
      'Marinate salmon with lemon and herbs',
      'Preheat grill to medium-high',
      'Grill salmon for 4-5 minutes per side',
      'Grill asparagus until tender-crisp'
    ]
  },
  {
    id: '3',
    name: 'Mediterranean Chickpea Salad',
    description: 'Fresh and light salad with protein-rich chickpeas',
    calories: 320,
    protein: 12,
    carbs: 45,
    fat: 14,
    prepTime: 15,
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=800',
    ingredients: [
      'Chickpeas',
      'Cucumber',
      'Cherry tomatoes',
      'Red onion',
      'Feta cheese',
      'Olive oil'
    ],
    tags: ['Vegetarian', 'Mediterranean', 'Quick'],
    instructions: [
      'Drain and rinse chickpeas',
      'Chop vegetables',
      'Combine ingredients in a bowl',
      'Dress with olive oil and lemon juice'
    ]
  }
];