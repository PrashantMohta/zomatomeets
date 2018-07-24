import React, { Component }from 'react';
import './App.css';
import MAP from "./mapcontainer";
import Overlay from './overlay'
const Header=(props)=>{
  return(
      <div className="Header">
      ZomatoMeets
      </div>
  );
}



class App extends Component {
  render() {
    return (
      <div className="App"  >
          <Header/>
          <div className="mapcontainer">
            <MAP/>
          </div>
          <Overlay/>

      </div>
    );
  }
}

export default App;
