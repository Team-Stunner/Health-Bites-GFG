import type { Restaurant } from '../types';

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Green Kitchen',
    address: '123 Health St, Wellness City',
    cuisine: 'Vegetarian',
    rating: 4.8,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300'
  },
  {
    id: '2',
    name: 'Fresh Catch',
    address: '456 Ocean Ave, Seaside Town',
    cuisine: 'Seafood',
    rating: 4.6,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300'
  },
  {
    id: '3',
    name: 'Mediterranean Delight',
    address: '789 Olive Way, Sunny Valley',
    cuisine: 'Mediterranean',
    rating: 4.7,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2a389?auto=format&fit=crop&w=300'
  }
];