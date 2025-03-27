// src/CalorieTracker.jsx
import React, { useState } from 'react';
import Card from './components/ui/card';   // Correct path to card.jsx
import Button from './components/ui/button';  // Correct path to button.jsx
import Input from './components/ui/input';    // Correct path to input.jsx

const initialFoodItems = [
  { name: "Apple", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Rice", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Egg", calories: 68, protein: 5.5, carbs: 0.6, fat: 4.8 },
  // Add more food items here
];

export default function CalorieTracker() {
  const [foodItems, setFoodItems] = useState(initialFoodItems);
  const [meals, setMeals] = useState({});
  const [userProfiles, setUserProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("calorieTracker")) || {};
    setMeals(savedData.meals || {});
    setUserProfiles(savedData.userProfiles || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("calorieTracker", JSON.stringify({ foodItems, meals, userProfiles }));
  }, [foodItems, meals, userProfiles]);

  const addUserProfile = (name) => {
    setUserProfiles([...userProfiles, { name, meals: {} }]);
  };

  const selectUser = (name) => {
    setSelectedUser(userProfiles.find((user) => user.name === name));
  };

  const addMeal = (mealType, foodName, quantity) => {
    if (!selectedUser) return;
    
    const food = foodItems.find((item) => item.name === foodName);
    if (!food) return;

    const mealData = selectedUser.meals[mealType] || [];
    mealData.push({
      name: foodName,
      quantity,
      calories: (food.calories * quantity) / 100,
      protein: (food.protein * quantity) / 100,
      carbs: (food.carbs * quantity) / 100,
      fat: (food.fat * quantity) / 100,
    });

    const updatedUser = { ...selectedUser, meals: { ...selectedUser.meals, [mealType]: mealData } };
    setUserProfiles(userProfiles.map((user) => (user.name === selectedUser.name ? updatedUser : user)));
  };

  const calculateTotal = () => {
    if (!selectedUser) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    Object.values(selectedUser.meals).forEach((meal) => {
      meal.forEach((food) => {
        total.calories += food.calories;
        total.protein += food.protein;
        total.carbs += food.carbs;
        total.fat += food.fat;
      });
    });
    return total;
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Calorie Tracker</h1>
      <div className="mt-4">
        <h2 className="text-xl">User Profiles</h2>
        <Input placeholder="Enter Name" />
        <Button className="mt-2">Add User</Button>
        <Button className="mt-2">Select User</Button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl">Add Meal</h2>
        <Input placeholder="Meal Type (e.g., Breakfast)" />
        <Input placeholder="Food Name" />
        <Input placeholder="Quantity (g)" type="number" />
        <Button className="mt-2">Add to Meal</Button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl">Daily Summary</h2>
        <Card>
          <CardContent>
            <p>Calories: {calculateTotal().calories}</p>
            <p>Protein: {calculateTotal().protein}g</p>
            <p>Carbs: {calculateTotal().carbs}g</p>
            <p>Fat: {calculateTotal().fat}g</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
