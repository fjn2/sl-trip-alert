import React, { useEffect, useState } from 'react';
import './App.css';
import { getDepartures } from './services/sl'

const STOP_AREA_NAME = 'AGA'
const DESTINATION = 'Ropsten'
const PULL_DATA_INTERVAL = 5000
const MIN_TIME_BEFORE_LEAVING = 6 * 60 * 1000
const WARNING_TIME_GAP = 3 * 60 * 1000

interface SLDepartureType {
  stopAreaName: string,
  destination: string,
  time: {
    displayTime: string,
    expectedDateTime: string
  }
}

const getTimeToLeaveStatus = (departure : SLDepartureType) : string => {
  const timeArrival : Date = new Date(departure.time.expectedDateTime)
  const diff = timeArrival.getTime() - new Date().getTime()
  console.log(timeArrival, diff, MIN_TIME_BEFORE_LEAVING)
  if (diff - MIN_TIME_BEFORE_LEAVING < 0) {
    return 'run-now'
  } else if (diff - MIN_TIME_BEFORE_LEAVING - WARNING_TIME_GAP < 0) {
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
        resp.filter((item : SLDepartureType) => {
          return item.stopAreaName === STOP_AREA_NAME && item.destination === DESTINATION
        })
        setRemainingTime(resp)
      })
    }, PULL_DATA_INTERVAL)
    return () => {
      clearInterval(intervalRef)
    }
  }, [])
  console.log(remainingTime)
  return (
    <div className="App">
      <header className="App-header">
        <div>
        <label className="switch">
          <input type="checkbox" />
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
