
import { connect } from 'react-redux'
import Mymap from './maps';

const mapStateToProps = (state) => {
    return {
        position:state.position,
        markers:state.smarkers,
        restmarkers:state.restmarkers,
        polygon:state.polygon,
        centroid:state.centroid,
        mref:state.mref,
    }
  }

  const mapDispatchToProps = (dispatch,state) => {
    return {

      handleClick: (e) => {
        dispatch({type:"ADD_MARKER",payload:e})
      },
      handleLocationFound: (e) => {
        dispatch({type:"LOCATION_FOUND",payload:e})
      },
      onload: () => {
        dispatch({type:"MAP_LOADED"})
      },

    }
  }

  const MAP = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: true }
  )(Mymap)
  
  export default MAP;