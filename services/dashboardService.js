import { getUserGoals, getUserGoalsLog } from "../repositories/dashboard.repository.js";

export async function getDashboardService(userId){

    try{

      const allGoals = await getUserGoals(userId);
      const allLogs = await getUserGoalsLog(userId);

      const userDashboard = calcDashinfo(allGoals, allLogs);

      //console.log(userDashboard);

      return userDashboard;

    }catch(err){

        throw new Error(err);

    }

}

function getStreak(logs){

    const dates = new Set();

    logs.forEach(log => {

        dates.add(log.date.toISOString().split("T")[0]);

    });

    const today = new Date();

    let streak = 0;

    while(true){

        const dateString = today.toISOString().split("T")[0];

        if(!dates.has(dateString)){

            break;

        }

        streak++;

        today.setDate(today.getDate() -1);

    }
    
    return streak;

}

function getLastSevenDays(){

    const lastDays = [];

    const today = new Date();

    for (let i = 0; i < 7; i++) {

        const date = new Date(today);

        date.setDate(today.getDate() - i);

        lastDays.push(date);

    }

    //console.log(lastDays);

    return lastDays;

}

function getProgress(logs){

    const today = new Date();

    const weeklogs = new Set();

    logs.forEach(log => {

        if((today - log.date) < 604800000){

            weeklogs.add(log);

        }

    });

    //console.log(weeklogs);

    const weekDay = new Map();

    for (const item of weeklogs){

        const key = item.date.toISOString().split('T')[0];

        if(!weekDay.has(key)){

            weekDay.set(key, []);

        }

        weekDay.get(key).push(item);

    }

    //console.log(weekDay);

    const weekDateProgress = Array.from(weekDay.values()).map(group => {

        const firstItem = group[0];

        //console.log(group);

        const sumCurrent = group.reduce((acc, curr)=> acc + curr.current_value, 0);
        const sumTarget = group.reduce((acc, curr)=> acc + curr.target_value, 0)

        return {
            date: firstItem.date,
            totalCurrent: sumCurrent,
            totalTarget: sumTarget
        };

    });

    //console.log(weekDateProgress);

    const lastDays = getLastSevenDays();

    const weekProgress = [];

    weekDateProgress.sort((a, b) => b.date - a.date);

    lastDays.forEach(day => {

        //console.log(day);
        //console.log(date.date.toLocaleDateString('en-US', {weekday: 'short'}))

        const dayProgress = {};

        for(const item in weekDateProgress){

            //console.log(weekDateProgress[item]);

            //console.log(day.toISOString().split('T')[0]);
            //console.log(weekDateProgress[item].date.toISOString().split('T')[0]);
            //console.log(day.toISOString().split('T')[0] === weekDateProgress[item].date.toISOString().split('T')[0]);

            let tempArray = [];

            if(day.toISOString().split('T')[0] === weekDateProgress[item].date.toISOString().split('T')[0]){

                tempArray.push(weekDateProgress[item].date.toLocaleDateString('en-US', {weekday: 'short'}), (weekDateProgress[item].totalCurrent / weekDateProgress[item].totalTarget));
                
                //console.log(day);
                //console.log(tempArray);

                dayProgress[day] = tempArray;

            }else if(!(day in dayProgress)){

                //console.log(day)

                tempArray.push(day.toLocaleDateString('en-US', {weekday: 'short'}), 0);

                dayProgress[day] = tempArray;

            }

        }

        if(Object.keys(dayProgress).length === 0){

            let tempArray = [];


            tempArray.push(day.toLocaleDateString('en-US', {weekday: 'short'}), 0);

            dayProgress[day] = tempArray;


        }

        weekProgress.push(dayProgress);

    });

    //console.log(weekProgress);

    return weekProgress;

}

function getTodayProgress(logs){

    const today = new Date();

    const todayStats = new Set();

    logs.forEach(log =>{

        if(today.toISOString().split('T')[0] === log.date.toISOString().split('T')[0]){

            todayStats.add(log);

        }

    });

    //console.log(todayStats);

    const todayGoal = Array.from(todayStats).map(log=>{

        //console.log(log);

        let sumCurrent = 0;
        sumCurrent = sumCurrent + log.current_value;
        let sumTarget = 0;
        sumTarget = sumTarget +  log.target_value;

        return {
            totalCurrent: sumCurrent,
            totalTarget: sumTarget
        };

    });

    const allTotalCurrent = todayGoal.reduce((acc, curr)=> acc + curr.totalCurrent, 0);

    const allTotalTarget = todayGoal.reduce((acc, curr)=> acc + curr.totalTarget, 0);

    return {
        current: allTotalCurrent,
        target: allTotalTarget,
        percentage: allTotalCurrent / allTotalTarget
    }

}

function calcDashinfo(goals, goalsLog){

    const streak = getStreak(goalsLog);

    const weekProgress = getProgress(goalsLog);

    const todayProgress = getTodayProgress(goalsLog);

   //console.log('Streak: ', streak);
   //console.log('weekProgress: ', weekProgress);
   //console.log('todayProgress: ', todayProgress);

   return {
    "streak": streak,
    "weekProgress": weekProgress,
    "todayGoal": todayProgress
   }

}