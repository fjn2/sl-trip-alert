import React, { useEffect, useState } from 'react';
import './App.css';
import { getDepartures } from './services/sl'
import beep from './beep'

const STOP_AREA_NAME = 'AGA'
const DESTINATION = 'Ropsten'
const PULL_DATA_INTERVAL = 5000
const MIN_TIME_BEFORE_LEAVING = 6 * 60 * 1000
const WARNING_TIME_GAP = 8 * 60 * 1000
const ONLY_RUN_TIME_GAP = 3 * 60 * 1000

// ZERO -- ONLY_RUN_TIME_GAP -- MIN_TIME_BEFORE_LEAVING -- WARNING_TIME_GAP -- GREEN
interface SLDepartureType {
  stopAreaName: string,
  destination: string,
  time: {
    displayTime: string,
    expectedDateTime: string
  }
}

const getNotificationStatus = (departures: Array<SLDepartureType>) => {
  const status = departures.map((departure) => {
    return getTimeToLeaveStatus(departure)
  })
  console.log(status)
  if (status.includes('warning')) {
    beep(250, 0.5);
    beep(1000, 0.2);
    beep(550, 0.5);
  }
}

const getTimeToLeaveStatus = (departure : SLDepartureType) : string => {
  const timeArrival : Date = new Date(departure.time.expectedDateTime)
  const diff = timeArrival.getTime() - new Date().getTime()

  if (diff - ONLY_RUN_TIME_GAP < 0) {
    return 'imposible-to-get'
  }
  else if (diff - MIN_TIME_BEFORE_LEAVING < 0) {
    return 'run-now'
  } else if (diff - WARNING_TIME_GAP < 0) {
    return 'warning'
  } else {
    return 'good'
  }
}

function App() {
  const [remainingTime, setRemainingTime] = useState([])
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    const intervalRef = setInterval(() => {
      getDepartures().then((resp) => {
        const subSet = resp.filter((item : SLDepartureType) => {
          return item.stopAreaName === STOP_AREA_NAME && item.destination === DESTINATION
        })
        setRemainingTime(subSet)
      })
    }, PULL_DATA_INTERVAL)
    return () => {
      clearInterval(intervalRef)
    }
  }, [])

  useEffect(() => {
    if (activated) {
      getNotificationStatus(remainingTime)
    }
  }, [remainingTime, activated])

  return (
    <div className="App">
      <header className="App-header">
        <h3>
            {`From "${STOP_AREA_NAME}" towards "${DESTINATION}"`}
        </h3>
        <div>
          <label className="switch">
            <input type="checkbox" onClick={() => setActivated(!activated)} checked={activated} />
            <span className="slider round"></span>
          </label>
        </div>
        <p>
          {remainingTime.map((departure: SLDepartureType, index: number) => {
            return (
              <span style={{ margin: '4px' }} className={`departure-${index} ${getTimeToLeaveStatus(departure)}`}>
                {departure.time.displayTime}
              </span>
            )
          })}
        </p>
      </header>
    </div>
  );
}

export default App;
