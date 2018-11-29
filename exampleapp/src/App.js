import React, { Component } from 'react';
import './App.css';
import jmap from 'jmap.js';
import MapUIKit from '@jibestream-dev/jmap-mapui-kit';
import MultiplePointMenu from './components/MutliplePointMenu.jsx';

class App extends Component {
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
      const ui = new MapUIKit(control, {padding: [20, 20, 20, 20]})
      console.log(activeVenue.destinations);
      ui.renderFloorSelector();
      ui.renderZoomButtons();
      ui.renderSearch();

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
      console.log('point 1 is', testPoint1, ' point 2 is ', testPoint2);
      // let access= true;
      // let testPath = control.wayfindBetweenWaypoints(testPoint1, testPoint2, access);
      // control.drawWayfindingPath(testPath);
      
      // let testPoint3 = activeVenue.maps.getWaypointById(145005);
      // let testPoint4 = activeVenue.maps.getWaypointById(145001);

      // let testPath2 = control.wayfindBetweenWaypoints(testPoint3, testPoint4, access);

      // control.drawWayfindingPath(testPath2);



      // control.drawWayfindingPath(w1,w2);

      control.enableLayerInteractivity('Units', unit => {
        // Remove highlight from all units;
        // control.resetAllUnitStyles(); 
        const highlight = new jmap.Style({ fill: '#D0D0D0'});
        control.styleShapes([unit], highlight)

        const waypoints = unit.meta.waypointIds || [];
        console.log( waypoints);

        if(waypoints.length){
          console.log (waypoints);
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
              // navigateToWayPoint(dest2);
            }
          })
        };
      })
    })
    const lastVisited = [2750, 2985]
    const navigateToWayPoint = (wp, lasVisited) => {
      const { control, activeVenue } = jibestream;
      const coords = control.userLocation.position
      const map = control.userLocation.map
      console.log(control);
      const userLocationWp = activeVenue.getClosestWaypointToCoordinatesOnMap(coords, map)
      const mostRecentLocation = activeVenue.getClosestWaypointToCoordinatesOnMap(lastVisited, map);
      const path = control.wayfindBetweenWaypoints(mostRecentLocation, wp)
      control.drawWayfindingPath(path)
      control.updateUserLocation(wp.coordinates, jibestream);
      console.log('new Coords', wp.coordinates)
      // lastVisited = wp.coordinates;
      control.zoomToPathOnMap(control.currentMap, new jmap.Animation({ duration: 1.5 }), 100)
    }

 
    const jibestream = jmap.init(config);
    

  }
  render() {
    return (
      <div className="App">
        
        <div className="map"></div>
        <MultiplePointMenu />
        
        

      </div>
    );
  }
}

export default App;
