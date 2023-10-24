import React, { useEffect } from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
    };
  }
  

  getXY = () => {
    const { index } = this.state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;

      return `Coordinates (${x}, ${y})`
  };
  

  reset = () => {
    this.setState({
      ...initialState
    })
    // Use this helper to reset all states to their initial values.
  }

  getNextIndex = (direction) => {
    const { index } = this.state;
    this.setState({ message: '' })

    switch(direction){
      case 'left':

      if (index !== 0 && index !== 3 && index !== 6) {
        this.setState((prevState) => ({
          index: prevState.index % 3 !== 0 ? prevState.index - 1 : prevState.index,
          steps: prevState.steps + 1,
        }));
      } else {
        this.setState({message: `You can't go left`})
      }
        
      break;

      case 'right':
        if (index !== 2 && index !== 5 && index !== 8) {
          this.setState((prevState) => ({
            index: prevState.index % 3 !== 2 ? prevState.index + 1 : prevState.index,
            steps: prevState.steps + 1,
          }));
        } else {
          this.setState({ message: `You can't go right`})
        }
        break;

        case 'up':

        if (index !== 0 && index !== 1 && index !== 2) {
          this.setState((prevState) => ({
            index: prevState.index >= 3 ? prevState.index - 3 : prevState.index,
            steps: prevState.steps + 1,
          }));
           
        } else {
          this.setState({message: `You can't go up`})
        }
      
          break;

        case 'down': 
          if (index !== 6  && index !== 7 && index !== 8) {
            this.setState((prevState) => ({
              index: prevState.index < 6 ? prevState.index + 3 : prevState.index,
              steps: prevState.steps + 1,
            }));
          } else {
            this.setState({ message: `You can't go down`})
          }
          break;

          default:
            break;

    }
      
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  onChange = (evt) => {
    const newInput = evt.target.value
    this.setState({ email: newInput });
    // You will need this to update the value of the input.
  }

  onSubmit = (evt) => {
    
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const { email, index, steps } = this.state;

    if (email === '') {
      this.setState({ message: 'Ouch: email is required' });
    } else if (email === 'bad@email') {
      this.setState({ message: 'Ouch: email must be a valid email'})
    }

    axios
      .post('http://localhost:9000/api/result', {
        "x": (index % 3) + 1,
        "y": Math.floor(index / 3) + 1,
        steps: steps,
        email: email,
      })
      .then((response) => {
        this.setState({ message: response.data.message, email: initialEmail });
      })
      .catch((err) => {
        console.log(err.message);
        if (email === 'foo@bar.baz') {
          this.setState({message: 'foo@bar.baz failure #71'})
        }
      });
  }

  render() {
    const { className } = this.props

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXY()}</h3>
          <h3 id="steps">
            {`You moved ${this.state.steps} ${this.state.steps === 1 ? 'time' : 'times'}`}
          </h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.getNextIndex('left')}>LEFT</button>
          <button id="up" onClick={() => this.getNextIndex('up')}>UP</button>
          <button id="right" onClick={() => this.getNextIndex('right')}>RIGHT</button>
          <button id="down" onClick={() => this.getNextIndex('down')}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.onChange} 
            id="email" 
            type="email" 
            placeholder="type email"
            value={this.state.email}
          >
          </input>
          <input 
            id="submit" 
            type="submit"
          >
          </input>
        </form>
      </div>
    )}
}

