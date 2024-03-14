import { createReadStream } from 'fs';
import path from 'path';
import { sortedInsert } from '../../utils/sortedInsert.js';
const compare = require('../../utils/compare.js');

const sortedActivities: {
  raw: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  activity: 'sleep' | 'wakes up' | 'shift',
  guardId?: number
}[] = []
const guards = {};

function gatherSortedActivities(){
  return new Promise<void>((resolve, reject) => {
    const readable = createReadStream(
      path.resolve(__dirname, 'input')
    )

    let leftovers = '';
    readable.on('data', chunk => {
      const currentData = leftovers + chunk.toString();
      const parts = currentData.split(/\n/g);
      leftovers = parts.splice(parts.length-1, 1)[0];
      for( let row of parts ){
        addActivityLog(
          getActivity(row)
        )
      }
    });
    readable.on('end', () => {
      //finish up the leftovers
      if( leftovers.length ){
        addActivityLog(
          getActivity(leftovers)
        )
      }
    });
    readable.on('close', () => {
      resolve();
    });
    readable.on('error', err => {
      reject(err);
    })
  })
}

function getActivity(rawData){
  const [
    raw,
    year,
    month,
    day,
    hour,
    minute,
    activity,
    guardId
  ] = rawData.match(/\[(\d+)-(\d+)-(\d+)\s(\d+):(\d+)\]\s(Guard\s#(\d+).+|.+)/);
  return {
    raw,
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
    hour: parseInt(hour, 10),
    minute: parseInt(minute, 10),
    activity: activity === 'falls asleep' ? 'sleep'
      : activity === 'wakes up' ? 'wake'
      : 'shift',
    guardId: guardId !== undefined ? parseInt(guardId, 10) : undefined
  }
}

function addActivityLog(activity){
  sortedInsert(
    sortedActivities,
    activity,
    function (a,b) {
      return a === undefined 
        ? -1 
        : b === undefined
        ? -1
        : compare(a.year, b.year)
          || compare(a.month, b.month)
          || compare(a.day, b.day)
          || compare(a.hour, b.hour)
          || compare(a.minute, b.minute)
          || 0;
    }
  )
}

gatherSortedActivities()
.then(() => {
  if( sortedActivities[0].guardId === undefined ){
    console.log("Bad data, no guard on entry 0");
    process.exit(0);
  }
  //assume we have well-formatted data from here on out
  let currentGuard;
  let lastSleepMinute;
  let maxMinutesAsleep = 0;
  let mostSleepyGuard;
  for( let activity of sortedActivities ){
    //update the current guard, making a new one if necessary
    if( activity.activity === 'shift' ){
      if( !guards[activity.guardId!] ) guards[activity.guardId!] = {
        id: activity.guardId,
        sleepMinutes: new Array(60).fill(1).reduce((map, val, index) => {
          map[index] = [];
          return map;
        }, {}),
        totalMinutesAsleep: 0,
        mostSleepyMinute: undefined
      }
      currentGuard = guards[activity.guardId!];
    }
    else if( activity.activity === 'sleep' ){
      lastSleepMinute = activity.minute;
    }
    else{
      //this is a waking event, we need to fill all the minutes between this and the last sleep
      for( let i=lastSleepMinute; i<activity.minute; i++ ){
        currentGuard.sleepMinutes[i].push(activity);
        currentGuard.totalMinutesAsleep++;
        if( currentGuard.totalMinutesAsleep > maxMinutesAsleep ){
          maxMinutesAsleep = currentGuard.totalMinutesAsleep;
          mostSleepyGuard = currentGuard;
        }
        if( currentGuard.mostSleepyMinute === undefined 
        || currentGuard.sleepMinutes[i].length > currentGuard.sleepMinutes[currentGuard.mostSleepyMinute].length ){
          currentGuard.mostSleepyMinute = i;
        }
      }
    }
  }
  console.log(`Most sleepy guard: ${mostSleepyGuard.id}`);
  console.log(`Guard ${mostSleepyGuard.id}'s most sleepy minute: 00:${mostSleepyGuard.mostSleepyMinute} on ${mostSleepyGuard.sleepMinutes[mostSleepyGuard.mostSleepyMinute].length} days.`);
  console.log(`Hash: ${mostSleepyGuard.id*mostSleepyGuard.mostSleepyMinute}`)
})
.catch(e => {
  console.error(e);
  process.exit(1);
});