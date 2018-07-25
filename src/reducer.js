import {sortPolygon,polygonCentroid} from './maps';
import React, {createRef } from 'react'

const markers=(points)=>{
    let mks=[];
    for(let point in points)
    {
      mks.push({key:point , position:[points[point].lat,points[point].lng],children:points[point].name})
    }
    return mks;
  }

  
  const loadoptions=(state,dispatch)=>{
    if(!state.centroid){alert("unknown"); return 0;}
   fetch(`https://developers.zomato.com/api/v2.1/geocode?lat=${state.centroid[0]}&lon=${state.centroid[1]}`,
   {
     method: 'post',
     headers: {"user-key": state.zomato_key,}
   }
   )
   .then(
     function(response) {
       if (response.status !== 200) {
         console.log('Looks like there was a problem. Status Code: ' +
           response.status);
         return;
       }
 
       response.json().then(function(data) {
         dispatch({type:"LOADED_ZOMATO_OPTIONS",data});
       });
     }
   )
   .catch(function(err) {
     console.log('Fetch Error :-S', err);
   });
  }


  const handleClick = (e,state) => {
    let newstate=Object.assign({},state);
    // where user clicked
   let pt=[e.latlng.lat,e.latlng.lng];
   newstate.points=[...newstate.points,{...e.latlng , name:`person`}];
   newstate.polygon=sortPolygon([...newstate.polygon,pt]);
   newstate.smarkers=markers(newstate.points);
   newstate.centroid=polygonCentroid(newstate.polygon);
   //console.log(polygonCentroid(newstate.polygon));
   return newstate;
  }

  // find user location
  const  handleLocationFound = (e,state) => {
    //user location found 
    //console.log(e.latlng);
    let pt=[e.latlng.lat,e.latlng.lng];
    let newstate=Object.assign({},state);
    newstate.position=pt;
    newstate.centroid=pt;
    newstate.firstload=false;
    return newstate;
  }
  //.responsedata.nearby_restaurants[8].restaurant.user_rating.aggregate_rating rating_text
const childs =(rests)=>{
    return (
  <div className="thumb">
    {rests.restaurant.name}
    <br/>
      <img className="thumbimage" src={rests.restaurant.thumb} />
    <br/>
    Ratings :{rests.restaurant.user_rating.aggregate_rating} | {rests.restaurant.user_rating.rating_text} 
  <hr/>
  <a className="thumbtext" href={rests.restaurant.url} target="_blank">Open on Web</a> |
  <a className="thumbtext" href={rests.restaurant.deeplink}>Open in App</a>
  </div>);
  }
const loadedZomatoOptions=(state,data)=>{
             let newstate=Object.assign({},state);
             newstate.responsedata=data;
             newstate.response=true;
             let rests=data.nearby_restaurants
             newstate.restmarkers=[];
             newstate.restmarkers=rests.map(
                (rests,i) =>
                {
                    let location = rests.restaurant.location;
                    
                    return {key:i , position:[location.latitude,location.longitude],children:childs(rests)
                        
                    };
                }
            )
             console.log(newstate);
             return newstate;
}

const DEFAULT_STATE = {
    zomato_key:"a92ac73de185b95468ae6f90591e876e",
    points:[],
    smarkers:[],
    restmarkers:[],
    polygon:[],
    position : [19.069526932819258,73.069526932819258],
    centroid:[0,0],
    mref:createRef(),
    firstload:true,
    response:false,
    responsedata:{},
}
export const reducer=(state=DEFAULT_STATE,action)=>{
    console.log(action.type);
    //console.log(state);
    switch(action.type)
    {
        case "LOADED_ZOMATO_OPTIONS":
        return loadedZomatoOptions(state,action.data)
        

        case "LOADING_ZOMATO_OPTIONS":
        //loading
        break;

        case "LOAD_ZOMATO_OPTIONS":
        loadoptions(state,action.dispatch)
        break;
           
        case "CLEAR_MARKERS":
        let newstate = Object.assign({},DEFAULT_STATE);
        newstate.position=state.position;
        newstate.response=true;
        return newstate

        case "ADD_MARKER":
        return handleClick(action.payload,state)

        case "LOCATION_FOUND":
        return handleLocationFound(action.payload,state)

        case "MAP_LOADED":
        if(state.firstload)
            state.mref.current.leafletElement.locate()   
        break;

        default:
        return state;

    }
return state;
}

