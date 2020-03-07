import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import DataNavigation from './DataNavigation/DataNavigation';


const SMALL_DATA = 'http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D';
const BIG_DATA = 'http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D';
const WORK_DATA = SMALL_DATA;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataType: WORK_DATA,
    };

    this.dataTypeChange = this.dataTypeChange.bind(this);
  }

  dataTypeChange(event) {
    console.log(event.target.value);

    switch (event.target.value) {
      default: {
        this.setState({
          dataType: WORK_DATA,
        });
        break;
      }
      case 'BIG': {
        this.setState({
          dataType: BIG_DATA,
        });
        break;
      }
      case 'SMALL': {
        this.setState({
          dataType: SMALL_DATA,
        });
        break;
      }
    }
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row justify-content-center pt-2 pb-2">
            <div className="col text-right">Выберите размер данных</div>
            <div className="col-3">
              <select onChange={this.dataTypeChange} className="form-control">
                <option>SMALL</option>
                <option>BIG</option>
              </select>
            </div>
          </div>
        </div>

        <DataNavigation dataType={this.state.dataType} />
      </div>
    );
  }
}


export default App;
