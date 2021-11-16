import React, { useEffect, useState } from 'react';
import './App.css';
import { getDepartures } from './services/sl'
import beep from './beep'
import notifyMe  from './notifyMe'
import askPermission from './askPermissions'

const MINUTES_TO_MS = 60 * 1000

const NOTIFICATION_MESSAGE = 'It is time to leave, you have to take the SL!'


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

const performNotificationActions = () => {
  notifyMe(NOTIFICATION_MESSAGE)
  return setInterval(() => {
    beep(250, 0.2);
    beep(300, 0.2);
    beep(400, 0.2);
    beep(500, 0.2);
    beep(600, 0.2);
  }, 5000)
}

const getNotificationStatus = (departures: SLDepartureType[]) => {
  const status = departures.map((departure) => {
    return getTimeToLeaveStatus(departure)
  })
  return status.includes('warning')
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
  const [error, setError] = useState('')
  const [activated, setActivated] = useState(false)
  const [notificationActivated, setNotificationActivated] = useState(false)

  const getDeparturesList = (data : SLDepartureType[]) => {
    const subSet : SLDepartureType[] = data.filter((item : SLDepartureType) => {
      return (
        (item.transport.direction === DIRECTION || !DIRECTION) &&
        (item.transport.transportType === TRANSPORT_TYPE || !TRANSPORT_TYPE)
      )
    })
    setDepartureList(subSet)
  }

  const getData = () => {
    const originId = getQueryParam('originId');

    setError('')
    getDepartures(originId).then((resp) => {
      getDeparturesList(resp)
    }).catch(e => {
      setError(e.message)
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
      const shouldActivate = getNotificationStatus(departureList)
      setNotificationActivated(shouldActivate)
    } else {
      setNotificationActivated(false)
    }
  }, [departureList, activated])

  useEffect(() => {
    let notificationIntervalRef : any
    if (notificationActivated) {
      notificationIntervalRef = performNotificationActions()
    }
    return () => {
      clearInterval(notificationIntervalRef)
    }
  }, [notificationActivated])
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <label className="switch">
            <input type="checkbox" onClick={() => {setActivated(!activated); !activated && askPermission()}} checked={activated} onChange={() => {}} />
            <span className="slider round"></span>
          </label>
        </div>
        <div style={{margin: 0}}>
          {departureList.map((departure: SLDepartureType, index: number) => {
            return (
              <div style={{ margin: '4px' }} key={JSON.stringify(departure)}>
                <div className={`departure-time departure-${index} ${getTimeToLeaveStatus(departure)}`}>
                  {departure.time.displayTime}
                </div>
                <div style={{fontSize: index ? '0.7rem' : '1.2rem'}}>
                  {`From "${departure.stopAreaName}" towards "${departure.destination}"`}
                </div>
              </div>
            )
          })}
        </div>
        <div className="imposible-to-get">
          {error}
        </div>
      </header>
    </div>
  );
}

export default App;
