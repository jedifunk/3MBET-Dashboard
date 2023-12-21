import React, { useState, useEffect } from 'react';

function Strava() {
  const [isLoading, setIsLoading] = useState(true)
  const [activities, setActivities] = useState({})

  //Strava Credentials
  const clientID = import.meta.env.PUBLIC_TH_STRAVA_CLIENT_ID
  const clientSecret = import.meta.env.PUBLIC_TH_STRAVA_CLIENT_SECRET

  // refresh token and call address
  const refreshToken = import.meta.env.PUBLIC_TH_STRAVA_RESET_TOKEN
  const callRefresh = `https://www.strava.com/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`
  
  // endpoint for read-all activities. temporary token is added in getActivities()
  const callActivities = `https://www.strava.com/api/v3/athlete/activities?access_token=`

  // Use refresh token to get current access token
  useEffect(() => {
    fetch(callRefresh, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(result => getActivities(result.access_token))
  }, [callRefresh])

  // use current access token to call all activities
  function getActivities(access){
    //console.log(callActivities + access)
      fetch(callActivities + access + '&per_page=50')
      .then(res => res.json())
      .then(data => data.filter(obj => obj.sport_type === 'Ride'))
      .then(data => setActivities(data), setIsLoading(prev => !prev))
      .catch(e => console.log(e))
  }

  function showActivities(){
    if(isLoading) return <>LOADING</>
    if(!isLoading) {
      console.log(activities)
      const data = Array.from(activities)
      return data.map((activity, i) => 
        <div key={i} className='grid'>
          <div>Name: {activity.name}</div>
          <div>Date: {activity.start_date}</div>
        </div>
      )
    }
  }

  return (
    <div className="App">
      {showActivities()}
    </div>
  );
}

export default Strava;