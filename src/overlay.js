import React from 'react';

import { connect } from 'react-redux'

const _Overlay=(props)=>{
    console.log(props)
        return(
            <div className="overlay">
                <button className="btn" onClick={props.clearmarkers}> Clear </button>
               <button className="btn" onClick={props.loadoptions}> Meet!  </button>
            </div>
        );
  }

  const mapStateToProps = (state) => {
    return {
    response:state.response,
    responsedata:state.responsedata,
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {

        loadoptions: (e) => {
        dispatch({type:"LOADING_ZOMATO_OPTIONS"})
        dispatch({type:"LOAD_ZOMATO_OPTIONS",dispatch})
      },
      clearmarkers: (e)=>
      {
        dispatch({type:"CLEAR_MARKERS"})
      }

    }
  }

const Overlay = connect(
    mapStateToProps,
    mapDispatchToProps,
  )(_Overlay);

export default Overlay;