import React from 'react'
import { Map, Marker, Popup, TileLayer ,Tooltip,  Polygon} from 'react-leaflet'
import L from 'leaflet';

const iconPerson = new L.Icon({
    iconUrl: require(`./person.png`),
    iconSize: new L.Point(32, 32),
    popupAnchor: [0,-16],
    iconAnchor: [16,32],
    className: 'leaflet-div-icon'
});

const iconPlace = new L.Icon({
    iconUrl: require(`./place.png`),
    iconSize: new L.Point(32, 32),
    popupAnchor: [0,-16],
    className: 'leaflet-div-icon'
});



const _R=6371000;

let sortBylatAsc=(a, b)=>{return a[0]-b[0]}
let sortBylatDes=(a, b)=>{return b[0]-a[0]}
let rad2degr=(rad) =>{ return rad * 180 / Math.PI; }
let degr2rad=(degr)=> { return degr * Math.PI / 180; }

let Cords2cart=(point)=>{
    let x = _R * Math.cos(degr2rad(point[0])) * Math.cos(degr2rad(point[1]))
    let y = _R * Math.cos(degr2rad(point[0])) * Math.sin(degr2rad(point[1]))
    let z = _R * Math.sin(degr2rad(point[0]));
    return [x,y,z];
  };
let cart2cords=(point)=>{
    return [ rad2degr(Math.asin(point[2] / _R) ), rad2degr(Math.atan2(point[1],point[0]))]
  };

function pointAboveLine(point, p1, p2) {
  let first;
  let second;

  if (p1[0] > p2[0]) {
      first = p2;
      second = p1;
  } else {
      first = p1;
      second = p2;
  }

  let v1 = [second[0] - first[0], second[1] - first[1]];
  let v2 = [second[0] - point[0], second[1] - point[1]];
  let xp = v1[0] * v2[1] - v1[1] * v2[0];
  if (xp > 0) {
      return true;
  }
  else if (xp < 0) {
      return false;
  }

}

export const polygonArea=(polygon)=>{
    let area=0;
    let temp_a=0;

    for( let i in polygon)
    {   
        console.log(i,polygon.length-2)
        if(i<polygon.length-2)
        temp_a+=(polygon[i][0]*polygon[Number(i)+1][1]-polygon[Number(i)+1][0]*polygon[i][1])
    }
    area=0.5*temp_a;
    return area;
}

export const polygonCentroid=(polygon)=>{
    let tp=[0,0,0];
    polygon=polygon.map(Cords2cart);

    for( let i in polygon)
    {   
        tp[0]+=polygon[i][0];
        tp[1]+=polygon[i][1];
        tp[2]+=polygon[i][2];
    }

    tp[0]/=polygon.length;
    tp[1]/=polygon.length;
    tp[2]/=polygon.length;
    return [cart2cords(tp)[0],cart2cords(tp)[1]];
}

export const sortPolygon = (unsortedPolygon) =>{
  if(unsortedPolygon.length <4)
  {return unsortedPolygon;}
  //cartesian
  unsortedPolygon=unsortedPolygon.map(Cords2cart);
  let sortedPolygon = [];
  unsortedPolygon=unsortedPolygon.sort(sortBylatAsc);
  let belowLR=[],aboveLR=[];
  let leftMost=unsortedPolygon[0],rightMost=unsortedPolygon[unsortedPolygon.length-1];
  for(let point of unsortedPolygon)
  {
    
    if(pointAboveLine(point,leftMost,rightMost))
      {aboveLR.push(point);
      }
    else if(!pointAboveLine(point,leftMost,rightMost))
      {belowLR.push(point);
      }
    

  }
  aboveLR.sort(sortBylatDes);
  belowLR.sort(sortBylatAsc);
  sortedPolygon=[leftMost,...belowLR,rightMost,...aboveLR];

  sortedPolygon=sortedPolygon.map(cart2cords)

  return sortedPolygon;
}

const MyPopupMarker = ({ children, position }) => (
    <Marker  position={position} opacity={0.4}>
      <Popup>{children}</Popup>
    </Marker>
  )

const Centroid = (props) => {
      if(props.position.length){
          return(   
            <Marker icon={iconPerson} position={props.position}>
            <Popup>{props.children}</Popup>
          </Marker>
        )
      }
      else{
          return("");
      }

  }
  
const MyMarkersList = ({ markers }) => {
    const items = markers.map(({ key, ...props }) => (
      <MyPopupMarker key={key} {...props} />
    ))
    return <div style={{ display: 'none' }}>{items}</div>
}


const MyRestMarker = ({ children, position }) => (
    <Marker  icon={iconPlace} position={position} opacity={1}>
      <Popup>{children}</Popup>
    </Marker>
    
  )

const MyRestMarkersList = ({ markers }) => {
    const items = markers.map(({ key, ...props }) => (
      <MyRestMarker key={key} {...props} />
    ))
    return <div style={{ display: 'none' }}>{items}</div>
}
class Mymap extends React.Component
{
    render(){
    let props=this.props;
    return(
      <Map 
      style={{height:`100%`}} 
      center={props.position} 
      zoom={14} 
      onClick={props.handleClick}
      onLocationfound={props.handleLocationFound}
      ref={props.mref}>
        <TileLayer
          onLoad={props.onload} 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        <MyMarkersList markers={props.markers} />
        <MyRestMarkersList markers={props.restmarkers}  />
        <Polygon color="blue" positions={props.polygon} />
        <Centroid children="Centroid point" position={props.centroid}/>
        
      </Map>)
    }
}

export default Mymap;