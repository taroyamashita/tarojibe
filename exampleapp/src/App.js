import React, { Component } from 'react';
import './App.css';
import jmap from 'jmap.js';
import MapUIKit from '@jibestream-dev/jmap-mapui-kit';
import MultiplePointMenu from './components/MutliplePointMenu.jsx';

let lastVisited = [2750, 2985]

class App extends Component {

  constructor(props){
    super(props)
    this.state ={
      activePaths: [],
      lastVisited: [2750, 2985],
      pathsToVisit: []
    }

  }


  // render paths based on input
  // complete 
  componentDidMount(){
    const config = {
      host: 'https://api.jibestream.com',
      auth: new jmap.core.Auth('5a1e5ea2-0610-4438-bafa-f19d276aa7e2', 'YMh/gJUh6rN6DvxbokCpLmuZC8pRqKfOnMs6PrOUEpM='),
      customerId: 51,
      venueId: 443,
      showAllAmenities: true,
      showAllPathTypes: true,
      width: '100%',
      height: '605',
      container: '.map',
      parseAllMaps: true,
      showAllImageMapLabels: true,
      showAllTextMapLabels: true,
      applyDisplayMode: true,
      limitConcurrentPaths: 1,
      userLocationOptions: {
        position: [2750, 2985],
        pulseVisible: true,
        width: 10,
        confidencePercent: 0.5
      } 
    }
    jmap.dispatcher.subscribe('ready', ()=>{
      const {control, activeVenue} = jibestream
      const ui = new MapUIKit(control, {padding: [20, 20, 20, 20]});
      ui.renderFloorSelector();
      ui.renderZoomButtons();
      ui.renderSearch();

      let names = activeVenue.destinations.getAll();
      console.log(names[0].name);

      control.enableLayerInteractivity('Amenity-Icons', icon =>{
        const wp = icon.meta.waypoint;
        // Wayfind from user location to icon;
        navigateToWayPoint(wp);
      });

      control.limitConcurrentPaths = false;

      console.log(control.limitConcurrentPaths);

      const destinations = activeVenue.destinations.getAll();
      console.log(destinations[0]);
      let testPoint1 = activeVenue.maps.getWaypointsByDestination(destinations[0])[0];
      let testPoint2 = activeVenue.maps.getWaypointsByDestination(destinations[destinations.length-1])[0];



      let map = control.currentMap; 

      control.enableLayerInteractivity('Units', unit => {
        // Remove highlight from all units;
        control.resetAllUnitStyles(); 
        const highlight = new jmap.Style({ fill: '#D0D0D0'});
        control.styleShapes([unit], highlight)

        const waypoints = unit.meta.waypointIds || [];

        if(waypoints.length){
          const wp = activeVenue.maps.getWaypointById(waypoints[0])
          const destinations = control.getDestinationsFromShape(unit);
          const dest = destinations.length ? destinations[0]: null;
    
          ui.renderPopup({
            coordinates: wp.coordinates,
            titleText: dest.name || 'Empty Unit',
            subText: `Waypoint ID: ${wp.id}`,
            showActionButton: true,
            actionButtonText: 'Navigate Here',
            actionButtonCallback: () => {
              navigateToWayPoint(wp)
            }
          })
        };
      })
    })

    const navigateToWayPoint = (wp, lasVisited) => {
      const { control, activeVenue } = jibestream;
      const coords = control.userLocation.position
      const map = control.userLocation.map
      const userLocationWp = activeVenue.getClosestWaypointToCoordinatesOnMap(coords, map)
      const mostRecentLocation = activeVenue.getClosestWaypointToCoordinatesOnMap(lastVisited, map);
      const path = control.wayfindBetweenWaypoints(mostRecentLocation, wp)
      
      const alternateMap = control.currentMap; 
      
      // Generate random Color 
      function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      let pathFill = getRandomColor();
      let pathStyle = new jmap.Style({
        stroke: pathFill,
        strokeWidth: 3
      })
      control.drawWayfindingPath(path, pathStyle);
      lastVisited = wp.coordinates;
      control.updateUserLocationPosition(wp.coordinates, 0, 2, alternateMap);
      control.zoomToPathOnMap(control.currentMap, new jmap.Animation({ duration: 1.5 }), 100)
    }

 
    const jibestream = jmap.init(config);
    

  }
  render() {
    return (
      <div className="App">
        
        <div className="map"></div>
        
        

      </div>
    );
  }
}

export default App;
