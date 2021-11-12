export const getDepartures = () => {
  return fetch('https://cors-anywhere.herokuapp.com/https://webcloud.sl.se/api/v2/departures?mode=departures&origPlaceId=QT0xQE89QWdhIChMaWRpbmfDtilAWD0xODE1NDU3OUBZPTU5MzQ2ODY1QFU9NzRATD0zMDAxMDkyNDhAQj0xQHA9MTYzNTk5MTIxMUA%3D&origSiteId=9248&desiredResults=3&origName=Aga+%28Liding%C3%B6%29', {
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

