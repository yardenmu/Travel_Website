import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config({ path: '../.env' });

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

export async function getQuery(userPreferences) {
    let { budget, date, duration, tripType, activityLevel, transport } = userPreferences;
    const season = await getSeasonFromDate(new Date(date));
    budget = Number(budget);
    duration = Number(duration);
    const budgetMin = budget - (budget * 0.7);  
    const budgetMax = budget + (budget * 0.5);
    transport = transport.replace('-', ' ');
    let [result] = await connection.query(`
        SELECT *
        FROM destinations
        WHERE (estimated_budget BETWEEN ? AND ?)
        AND season = ?
        AND (recommended_duration  BETWEEN ? AND ?)
        AND trip_type = ?
        AND activity_level = ?
        AND transport = ?
        `,[budgetMin,budgetMax, season, duration -2 , duration + 2, tripType, activityLevel,transport]); 
    if(result.length === 0){
        const [secondResult] = await connection.query(`
            SELECT*
            FROM destinations
            WHERE (estimated_budget BETWEEN ? AND ?)
            AND season = ?
            AND (recommended_duration  BETWEEN ? AND ?)
            AND trip_type = ?`
            ,[budgetMin,budgetMax, season, duration -2 , duration + 2, tripType]);
       return secondResult;
    }
    return result;
}

function getSeasonFromDate(date){
    const month = date.getMonth() + 1;
    if (month >= 12 || month <= 2){
        return "winter";
    }
    else if ( month >= 3 && month <= 5){
        return "spring";
    }
    else if (month >= 6 && month <= 8){
        return "summer";
    }
    else{
        return "autumn";
    }

}

