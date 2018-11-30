import React, { Component } from 'react';
import './App.css';
import jmap from 'jmap.js';
import MapUIKit from '@jibestream-dev/jmap-mapui-kit';
import MultiplePointMenu from './components/MutliplePointMenu.jsx';

let lastVisited = [2750, 2985];
let stopCount = 1; 

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

      function animatePaths(paths) {
        let i = 0
        // Animate initial path
        paths[i].animate(15)
      
        // Set loop to repeat animation
        setInterval(() => {
          if (++i === paths.length) i = 0
          paths[i].animate(0.5)
        }, 1000)
      }

      const paths = control.getShapesInLayer('Wayfinding-Path');
      console.log(paths);
      // animatePaths(paths);

      console.log(control.limitConcurrentPaths);

      const destinations = activeVenue.destinations.getAll();
      console.log(destinations[0]);
      let testPoint1 = activeVenue.maps.getWaypointsByDestination(destinations[0])[0];
      let testPoint2 = activeVenue.maps.getWaypointsByDestination(destinations[destinations.length-1])[0];

      const testPath = control.wayfindBetweenWaypoints(testPoint1, testPoint2);

      //control.drawWayfindingPath(testPath);
  

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
              navigateToWayPoint(wp);
              stopCount++
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
        strokeWidth: 5
      })
      // control.drawWayfindingPath(path, pathStyle);
      drawPath(mostRecentLocation, wp);
      lastVisited = wp.coordinates;
      control.updateUserLocationPosition(wp.coordinates, 0, 2, alternateMap);
      control.zoomToPathOnMap(control.currentMap, new jmap.Animation({ duration: 1.5 }), 100)
      const paths = control.getShapesInLayer('Wayfinding-Path');
      console.log(paths);

      function animatePaths1(paths) {
        let i = 0
        // Animate initial path
        // paths[i].animate(15)
      
        // Set loop to repeat animation
        setInterval(() => {
          if (++i === paths.length) i = 0
          paths[i].animate(1.5)
        }, 2000)
      } 
      
      function drawPath(_from, _to) {
        const data = window.drawnPathData
        {}
      
        // Calculate a wayfinding path
        const path = control.wayfindBetweenWaypoints(_from, _to)
        // Show first map on path
        const startMap = jibestream.activeVenue.maps.getById(path[0].mapId)
        control.showMap(startMap)
      
        // Create a style for the path
        const pathStyle = new jmap.Style({
          stroke: '#202020',
          strokeOpacity: 0.8,
          strokeWidth: 3,
        })
      
        // Draw the path on the map
        control.drawWayfindingPath(path, pathStyle)
      
        // Create start & end Icon
        const icons = {
          1: new control.jungle.Icon({
            url: './assets/one.png',
            width: 50,
            height: 50,
            point: _from.coordinates,
            rotateWithMap: true,
            rotation: 0,
            name: 'start',
          }),
          2: new control.jungle.Icon({
            url: './assets/two.png',
            width: 50,
            height: 50,
            point: _to.coordinates,
            rotateWithMap: true,
            rotation: 0,
            name: 'end',
          }),
          3: new control.jungle.Icon({
            url: './assets/three.png',
            width: 50,
            height: 50,
            point: _to.coordinates,
            rotateWithMap: true,
            rotation: 0,
            name: 'end',
          }),
          4: new control.jungle.Icon({
            url: './assets/four.png',
            width: 50,
            height: 50,
            point: _to.coordinates,
            rotateWithMap: true,
            rotation: 0,
            name: 'end',
          }), 
          5: new control.jungle.Icon({
            url: './assets/five.png',
            width: 50,
            height: 50,
            point: _to.coordinates,
            rotateWithMap: true,
            rotation: 0,
            name: 'end',
          })
        }
      
        // Get the mapView objects to place icons on
        const mapViews = {
          start: control.stage.getMapViewById(path[0].mapId),
          end: control.stage.getMapViewById(path[path.length - 1].mapId),
        }
      
        // Get the path layers on each map to place the icon
        const pathLayers = {
          start: mapViews.start.guaranteeMapLayer('Wayfinding-Path'),
          end: mapViews.end.guaranteeMapLayer('Wayfinding-Path'),
        }
      
        // Add the icons to each layer
        pathLayers.start.addIcon(icons[stopCount.toString()])
        pathLayers.end.addIcon(icons[stopCount.toString()]);
      
        // Render the just added Icons
        control.renderCurrentMapView()
      
        // Focus to the path
        const paths = control.getShapesInLayer('Wayfinding-Path', startMap)
        const bounds = control.getBoundsFromShapes(paths)
        control.fitBoundsInView(bounds, new jmap.Animation({ duration: 1 }), 150)
        animatePaths(paths, pathLayers);
        // data.icons = icons
      }

      function animatePaths(paths, pathLayers) {
        // Animate initial path
        const path = paths[paths.length -1]; 
        const pathLayer = pathLayers.start
        const pointData = path.getPointDataAtLength(0)
        const pathIcon = createPathIcon(pointData)
        pathLayer.addImage(pathIcon)
        animateIconOnPath(pathIcon, path)
        control.renderCurrentMapView();
        
      }
      
      function animateIconOnPath(icon, path) {
        // Animate Icon on Path
        let position = 0
        const animate = () => {
          window.requestAnimationFrame(() => {
            if (position > path.length) position = 0
            const data = path.getPointDataAtLength(position++)
            icon.setRotation(data.angle)
            icon.setPoint(data.point)
            animate()
          })
        }
        animate()
      }
      
      function createPathIcon(data) {
        const size = 10
        return new control.jungle.Image({
          url: './assets/path-arrow.png',
          point: data.point.map(p => p - (size / 2)),
          width: size,
          height: size,
          rotation: data.angle,
          visible: true,
          scaleWithMap: true,
          preserveAspectRatio: true,
        })
      }
      

      
      // animatePaths(paths);
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
