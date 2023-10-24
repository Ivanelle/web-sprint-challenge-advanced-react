import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Suggested initial states
const initialValues = {
message: '',
email: '',
steps: 0,
index: 4 // the index the "B" is at
};

function CustomTextMatcher(content, element) {
  const hasText = (node) => node.textContent === content;
  const elementHasText = hasText(element);

  if (elementHasText) {
    return true
  }
  const children = Array.from(element.children);
  return children.some((child) => CustomTextMatcher(content, child))
}


export default function AppFunctional(props) {
  const [index, setIndex] = useState(4);
  const [initialIndex, setInitialIndex] = useState(4)
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [steps, setSteps] = useState(initialValues.steps)
    
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  function getXY() {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
  
    return `Coordinates (${x}, ${y})`;
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function reset() {
   setIndex(initialValues.index);
   setSteps(initialValues.steps);
   setMessage(initialValues.message);
   setEmail(initialValues.email);
    // Use this helper to reset all states to their initial values.
  }

  function onChange(evt) {
    const newInput = evt.target.value;
    setEmail(newInput);
    // You will need this to update the value of the input.
  }
  
  function getNextIndex(direction) {
    setMessage('')

      switch (direction) {
        case 'left': 
          setIndex(index % 3 !== 0 ? index - 1 : index)
          if (index == 0 || index == 3 || index == 6) {
            setMessage(`You can't go left`)
          } 
          break; 
  
        case 'right':
          setIndex(index % 3 !== 2 ? index + 1 : index);
          if (index == 2 || index == 5 || index == 8) {
            setMessage(`You can't go right`)
          } else {
            setMessage('')
          }
          break;
  
        case 'up':       
          setIndex(index >= 3 ? index - 3 : index);
          if (index === 0 || index === 1 || index === 2) {
            setMessage(`You can't go up`)
          } else {
            setMessage('')
          }
          break;
        
        case 'down': 
          setIndex(index < 6 ? index + 3 : index );
          if (index === 6 || index === 7 || index === 8) {
            setMessage(`You can't go down`)
          } else {
            setMessage('')
          }
            break;
  
        default: 
          break;

    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  

  function onSubmit(evt) {
    evt.preventDefault();
    if (email === '') {
      setMessage('Ouch: email is required')
    }
    if(email === 'lady@gaga.com') {
      setMessage('lady win #73')
    }

    axios.post(`http://localhost:9000/api/result`, 
    { 
      "x": (index % 3) + 1, 
      "y": Math.floor(index / 3) + 1,
      steps: steps,
      email: email
    })
    .then(response => {
      console.log(response)
      setMessage(response.data.message)
      setEmail(initialValues.email)
      
    })
    .catch(err => {
      console.error(err.message)
      if (email === 'foo@bar.baz'){
      setMessage('foo@bar.baz failure #71')
  }})
    // Use a POST request to send a payload to the server.
  }
  

  useEffect(() => {
  
    if (index !== initialIndex){
      setSteps(prevSteps => prevSteps + 1 )
    }
    if (steps >= 1) {
      setSteps(steps + 1 )
    }
  }, [index])

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXY()}</h3>
        <h3 id="steps">{`You moved ${steps} ${steps === 1 ? 'time' : 'times'}`}</h3>
      </div>
      <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
                {idx === index ? 'B' : null}
              </div>
            ))
          }
    
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => getNextIndex('left')}>LEFT</button>
        <button id="up" onClick={() => getNextIndex('up')}>UP</button>
        <button id="right" onClick={() => getNextIndex('right')}>RIGHT</button>
        <button id="down" onClick={() => getNextIndex('down')}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input 
          onChange={onChange} 
          id="email" 
          type="email" 
          value={email}
          placeholder="type email"
        >
        </input>
        <input id="submit" type="submit" ></input>
      </form>
    </div>
  )
}
