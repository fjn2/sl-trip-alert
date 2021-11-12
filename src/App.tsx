import React, { useEffect, useState } from 'react';
import './App.css';
import { getDepartures } from './services/sl'
import beep from './beep'

const MINUTES_TO_MS = 60 * 1000


const getQueryParam = (key: string) : string => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key) || '';
}
const TRANSPORT_TYPE = getQueryParam('transportType')
const DIRECTION = ~~getQueryParam('direction')

const PULL_DATA_INTERVAL = 5000

const WARNING_TIME_GAP = (~~getQueryParam('warning') || 8) * MINUTES_TO_MS
const MIN_TIME_BEFORE_LEAVING = (~~getQueryParam('run') || 6) * MINUTES_TO_MS
const ONLY_RUN_TIME_GAP = (~~getQueryParam('noWay') || 3) * MINUTES_TO_MS

// ZERO -- ONLY_RUN_TIME_GAP -- MIN_TIME_BEFORE_LEAVING -- WARNING_TIME_GAP -- GREEN
interface SLDepartureType {
  stopAreaName: string,
  destination: string,
  time: {
    displayTime: string,
    expectedDateTime: string
  },
  transport: {
    direction: number,
    transportType: string
  }
}

const getNotificationStatus = (departures: SLDepartureType[]) => {
  const status = departures.map((departure) => {
    return getTimeToLeaveStatus(departure)
  })

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
  const [departureList, setDepartureList] = useState<SLDepartureType[]>([])
  const [activated, setActivated] = useState(false)
  const [stopName, setStopName] = useState('')
  const [towardsName, setTowardsName] = useState('')

  const getDeparturesList = (data : SLDepartureType[]) => {
    const subSet : SLDepartureType[] = data.filter((item : SLDepartureType) => {
      return (
        item.transport.direction === DIRECTION &&
        item.transport.transportType === TRANSPORT_TYPE
      )
    })
    setDepartureList(subSet)
  }

  const getData = () => {
    const originId = getQueryParam('originId');

    getDepartures(originId).then((resp) => {
      getDeparturesList(resp)
    })
  }

  useEffect(() => {
    getData()
    const intervalRef = setInterval(() => {
      getData()
    }, PULL_DATA_INTERVAL)
    return () => {
      clearInterval(intervalRef)
    }
  }, [])

  useEffect(() => {
    if (activated) {
      getNotificationStatus(departureList)
    }
    const [firstDeparture] = departureList
    if (firstDeparture) {
      setTowardsName(firstDeparture.destination)
      setStopName(firstDeparture.stopAreaName)
    }
  }, [departureList, activated])

  return (
    <div className="App">
      <header className="App-header">
        <h3>
            {`From "${stopName}" towards "${towardsName}"`}
        </h3>
        <div>
          <label className="switch">
            <input type="checkbox" onClick={() => setActivated(!activated)} checked={activated} />
            <span className="slider round"></span>
          </label>
        </div>
        <p>
          {departureList.map((departure: SLDepartureType, index: number) => {
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
