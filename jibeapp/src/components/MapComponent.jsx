import React, { Component } from 'react';
import jmap from 'jmap.js';
import MapUIKit from '@jibestream-dev/jmap-mapui-kit';

class MapComponent extends Component {
    componentDidMount(){
        const config = {
          host: 'https://api.jibestream.com',
          auth: new jmap.core.Auth('5a1e5ea2-0610-4438-bafa-f19d276aa7e2', 'YMh/gJUh6rN6DvxbokCpLmuZC8pRqKfOnMs6PrOUEpM='),
          customerId: 51,
          venueId: 443,
          showAllAmenities: true,
          showAllPathTypes: true,
          width: '100%',
          height: '600',
          position: 'absolute',
          container: '.map',
          parseAllMaps: true,
          showAllImageMapLabels: true,
          showAllTextMapLabels: true,
          applyDisplayMode: true,
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
    
          ui.renderFloorSelector();
          ui.renderZoomButtons();
          ui.renderSearch();
    
          control.enableLayerInteractivity('Amenity-Icons', icon =>{
            const wp = icon.meta.waypoint;
            // Wayfind from user location to icon;
            navigateToWayPoint(wp);
    
          })
    
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
        const navigateToWayPoint = wp => {
          const { control, activeVenue } = jibestream
          const coords = control.userLocation.position
          const map = control.userLocation.map
          const userLocationWp = activeVenue.getClosestWaypointToCoordinatesOnMap(coords, map)
          const path = control.wayfindBetweenWaypoints(userLocationWp, wp)
          control.drawWayfindingPath(path)
          control.zoomToPathOnMap(control.currentMap, new jmap.Animation({ duration: 1.5}), 100)
        }
        const jibestream = jmap.init(config);
    
      }
      render() {
        return (
              <div className="container">
                
                <div className="map"></div>
              </div>
              
        );
      }
}

export default MapComponent 