const HOST = process.env.REACT_APP_BACKEND_URL

export const getDepartures = (originId: string) => {
    return fetch(`${HOST}/api/sl?originSiteId=${originId}`, {
    'headers': {
      'accept': '*/*',
      'accept-language': 'en-US',
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'X-Requested-With': ''
    },
    'referrer': 'https://sl.se/',
    'referrerPolicy': 'origin-when-cross-origin',
    'body': null,
    'method': 'GET',
    'mode': 'cors',
    'credentials': 'omit'
  }).then(resp => resp.json())
}

