import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface DietContextType {
    targetCalories: number;
    setTargetCalories: (calories: number) => void;
    setTodayCalories: (calories: number) => void;
    foodEntries:any,
    setFoodEntries:any,
    todayCalories:number ;
}

const DietContext = createContext<DietContextType | undefined>(undefined);

export const DietProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [targetCalories, setTargetCalories] = useState<number>(2000); // Default value
    const [todayCalories, setTodayCalories] = useState<number>(0);
    const [foodEntries, setFoodEntries] = useState<any>([]);

    const userid = localStorage.getItem('userid') || '';
    const backendurl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchTodayCalories = async () => {
            try {
                const response = await axios.get(`${backendurl}/meal/today-calories/${userid}`);
                if(response)
           {     console.log(response)
                setTodayCalories(response.data.totalCalories);
                setFoodEntries(response.data.meals);}

            } catch (error) {
                console.error("Error fetching today's calories:", error);
            }
        };

        if (userid) {
            fetchTodayCalories();
        }
    }, [userid]);

    return (
        <DietContext.Provider value={{ targetCalories,setTodayCalories,setTargetCalories ,foodEntries,setFoodEntries, todayCalories }}>
            {children}
        </DietContext.Provider>
    );
};

export const useDiet = (): DietContextType => {
    const context = useContext(DietContext);
    if (!context) {
        throw new Error("useDiet must be used within a DietProvider");
    }
    return context;
};
