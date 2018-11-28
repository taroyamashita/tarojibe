import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import jmap from 'jmap.js';
import MapUIKit from '@jibestream-dev/jmap-mapui-kit';
import MapComponent from '/Users/jibestreamadmin/Desktop/git/tarojibe/jibeapp/src/components/MapComponent.jsx';
import  TemplateContent  from './components/TemplateContent.js';



const style = {
  width: "50%",
  height: "600px"
}

class App extends Component {



  componentDidMount(){
    // let doc = document.getElementById('test').contentWindow.document;
    // doc.open();
    // doc.write(TemplateContent());
    // doc.close();
    const config ={
      host: 'https://api.jibestream.com',
      auth: new jmap.core.Auth('5a1e5ea2-0610-4438-bafa-f19d276aa7e2', 'YMh/gJUh6rN6DvxbokCpLmuZC8pRqKfOnMs6PrOUEpM='),
      customerId: 51,
      venueId: 443,
      showAllAmenities: true,
      showAllPathTypes: true,
      width: '100%',
      height: '600',
      position: "relative",
      container: '.map'

    }
  }

 
  render() {
    return (
        <div className="App" >
          <h1> Example App </h1>
          {/* <MapComponent /> */}
          <iframe src="http://localhost:3003" id="test" style={style}></iframe>
          <form> 
            <input /> 


          </form>
          
          
        </div>
    );
  }
}

export default App;
