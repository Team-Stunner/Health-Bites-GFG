import React, { useState } from 'react';
import { ShoppingCart, Check, Plus, Trash2 } from 'lucide-react';
import { useFood } from '../hooks/useFood';

export const GroceryList: React.FC = () => {
  const { weeklyMealPlan } = useFood();
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  // Generate grocery list from meal plan
  const groceryItems = weeklyMealPlan.reduce<string[]>((items, meal) => {
    meal.ingredients.forEach(ingredient => {
      if (!items.includes(ingredient)) {
        items.push(ingredient);
      }
    });
    return items;
  }, []);

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const addCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim() && !customItems.includes(newItem.trim())) {
      setCustomItems([...customItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeCustomItem = (item: string) => {
    setCustomItems(customItems.filter(i => i !== item));
    const newChecked = new Set(checkedItems);
    newChecked.delete(item);
    setCheckedItems(newChecked);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <ShoppingCart className="h-6 w-6 mr-2 text-green-600" />
        Grocery List
      </h2>

      <form onSubmit={addCustomItem} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add custom item"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        <button
          type="submit"
          className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Plus className="h-5 w-5" />
        </button>
      </form>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg mb-3">From Meal Plan</h3>
        {groceryItems.map((item) => (
          <div
            key={item}
            className="flex items-center p-3 bg-gray-50 rounded-lg group"
          >
            <button
              onClick={() => toggleItem(item)}
              className={`flex items-center justify-center w-6 h-6 rounded border mr-3 ${
                checkedItems.has(item)
                  ? 'bg-green-600 border-green-600'
                  : 'border-gray-300'
              }`}
            >
              {checkedItems.has(item) && (
                <Check className="h-4 w-4 text-white" />
              )}
            </button>
            <span className={checkedItems.has(item) ? 'line-through text-gray-500' : ''}>
              {item}
            </span>
          </div>
        ))}

        {customItems.length > 0 && (
          <>
            <h3 className="font-semibold text-lg mt-6 mb-3">Custom Items</h3>
            {customItems.map((item) => (
              <div
                key={item}
                className="flex items-center p-3 bg-gray-50 rounded-lg group"
              >
                <button
                  onClick={() => toggleItem(item)}
                  className={`flex items-center justify-center w-6 h-6 rounded border mr-3 ${
                    checkedItems.has(item)
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-300'
                  }`}
                >
                  {checkedItems.has(item) && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </button>
                <span className={`flex-1 ${checkedItems.has(item) ? 'line-through text-gray-500' : ''}`}>
                  {item}
                </span>
                <button
                  onClick={() => removeCustomItem(item)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Items: {groceryItems.length + customItems.length}</span>
          <span>Checked: {checkedItems.size}</span>
        </div>
      </div>
    </div>
  );
};