const TemplateContent = {
    html: `
    <!DOCTYPE html>
    <html>
  <head>
    <style>
      body, html {
        margin:0px;
        height:100%;
        overflow:hidden;
      }
      .map, canvas {
        width:100%;
        height:100%;
      }
    </style>
    <!--

    *** NOTE ***

    If this example uses external assets, you may encounter a 404 for each image

    This is because you do not have external resource on your local machine.
    Swap out the assets for some of your own local assets to resolve this issue.

    - Jibestream

    -->
  </head>
  <body>
    <div id="map" class="map"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/easing/EasePack.min.js"></script>
    
        <script src="https://cdn.jibestream.com/web/4.5.4/jmap.min.js"></script>
        
    <script>
      // Auth creds
      window.clientId = '5a1e5ea2-0610-4438-bafa-f19d276aa7e2';
      window.clientSecret = 'YMh/gJUh6rN6DvxbokCpLmuZC8pRqKfOnMs6PrOUEpM=';

      // Run code example
      window.onload = function(){
        'use strict';

var config = {
host: 'https://api.jibestream.com',
auth: new jmap.core.Auth(clientId, clientSecret),
customerId: 51,
venueId: 443,
showAllAmenities: true,
showAllPathTypes: true
};

jmap.dispatcher.subscribe('ready', function () {
// Scale map out
jibestream.control.setMapTransform(new jmap.Transform({ scale: 0.3 }));
});

// Create new jmap instance and show map
var jibestream = jmap.init(config);

      }
    </script>
  </body>
</html>
    `
}


export default TemplateContent;

    