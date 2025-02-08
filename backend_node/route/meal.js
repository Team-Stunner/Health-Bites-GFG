const express = require('express');
const router = express.Router();
const DailyMealPlan = require('../model/Meal'); // Import correct model
const moment = require('moment'); // For date filtering

// Get total calories for today
router.get('/today-calories/:userid', async (req, res) => {
    try {


        userid = req.params.userid.replace(/^"|"$/g, '');
        // Get today's date range
        const startOfDay = moment().startOf('day').format('YYYY-MM-DD'); // Convert to string format
        const endOfDay = moment().endOf('day').format('YYYY-MM-DD');
        console.log(startOfDay)
        console.log(endOfDay)
        // Find today's meal plan
        const mealPlan = await DailyMealPlan.findOne({
            user: userid,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        // If no entry found, return 0 calories
        if (!mealPlan) {
            return res.json({ totalCalories: 0 });
        }
        console.log(mealPlan)
        res.json({ totalCalories: mealPlan.totalCalories, meals: mealPlan.meals });
    } catch (error) {
        console.error("Error fetching today's calories:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/add-food', async (req, res) => {
    try {
        const { userid, foodName, calories, mealTime } = req.body;
        console.log(req.body)
        if (!userid || !foodName || !calories) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const today = moment().format('YYYY-MM-DD');
        console.log(typeof (today))
        const userId = userid.replace(/^"|"$/g, '');
        let dailyMealPlan = await DailyMealPlan.findOne({ user: userId, date: today });

        if (!dailyMealPlan) {
            // Create a new daily meal plan for today
            dailyMealPlan = new DailyMealPlan({
                user: userId,
                date: today,
                meals: [],
                totalCalories: 0
            });
        }

        // Add new meal entry
        dailyMealPlan.meals.push({ foodName, calorieCount: calories, mealTime });
        dailyMealPlan.totalCalories += calories; // Update total calorie count

        await dailyMealPlan.save();

        res.status(201).json({ message: "Food added successfully!", dailyMealPlan });
    } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


router.get('/food-history/:userid', async (req, res) => {
    try {
        const userid = req.params.userid.replace(/^"|"$/g, '');
        const days = parseInt(req.query.days) || 7; // Default to 7 days

        const endDate = moment().endOf('day');
        const startDate = moment().subtract(days - 1, 'days').startOf('day');

        const mealPlans = await DailyMealPlan.find({
            user: userid,
            date: {
                $gte: startDate.format('YYYY-MM-DD'),
                $lte: endDate.format('YYYY-MM-DD')
            }
        }).sort({ date: -1 });

        res.json({ success: true, mealPlans });
    } catch (error) {
        console.error("Error fetching food history:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
