import React, { Component } from 'react';
import './App.css';



const style = {
  width: "50%",
  height: "600px"
}

class App extends Component {



  componentDidMount(){}

 
  render() {
    return (
        <div className="App" >
          <h1> Example App </h1>
          {/* <MapComponent /> */}
          <iframe src="http://localhost:3000" id="test" style={style}></iframe>
          <form> 
            <input /> 


          </form>
          
          
        </div>
    );
  }
}

export default App;
