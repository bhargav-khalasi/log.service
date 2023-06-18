const axios = require('axios');

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Function to generate a random event name
function getRandomEventName() {
  const eventNames = ['login', 'logout'];
  const randomIndex = getRandomInt(0, eventNames.length - 1);
  return eventNames[randomIndex];
}

// Function to generate a random payload for the request
function generateRandomPayload() {
  const id = Date.now()/1000;
  const unix_ts =  Date.now()/1000;
  const user_id = getRandomInt(1, 1000);
  const event_name = getRandomEventName();

  return {
    id,
    unix_ts,
    user_id,
    event_name
  };
}

// Function to send a POST request to the "/log" API endpoint
async function sendRequest() {
  const payload = generateRandomPayload();

  try {
    await axios.post('http://localhost:3000/log', payload);
    console.log('Request sent:', payload);
  } catch (error) {
    console.error('Error sending request:', error.message);
  }
}

// Function to generate the desired load of requests
function generateLoad() {
  setInterval(sendRequest, 1); // 1000 requests per second (1 request every 1 millisecond)
}

// Start generating the load
generateLoad();
