let map;                     // Map object from MapLibre
let cities = [];              // All cities loaded from JSON
let remainingCities = [];     // Cities that haven't been asked yet
let currentCity = null;       // City currently being asked
let answerMarker = null;      // Marker shown when user guesses wrong 3 times
let attempts = 0;             // How many tries the user has made for current city
let correctCount = 0;         // Number of correct answers
let questionCount = 0;        // Number of questions shown so far
let quizLocked = false;       // Prevent clicks while revealing city
let sessionEnded = false;     // Track if quiz is finished
let totalQuestions = 10;      // Total questions for this session

// finding HTML elements from the page and storing them in JavaScript variables
const quizContainer = document.getElementById('quizContainer');
const statusEl = document.getElementById('status');
const backButton = document.getElementById('backButton');


// tells it to make the current page index.html when "Back" button is clicked
// .addEventListener() is a method that listens for events on that element.
// 'click' means we are listening for a click event
// () => { ... }: arrow function, inside the { ... } will run when the button is clicked.
backButton.addEventListener('click', () => {
  window.location.href = "index.html";
});


// GET REGION FROM URL
// Read the "region" parameter from the URL, default to "world"
// window.location = the object representing the current page URL.
// .search = the string part of the URL, which comes after the ?
// quiz.html?region=france -> ?region=france
// urlParams.get("region")  // returns "france"
// urlParams: "python dictionary: key-value pairs"
// URLSearchParams: in-built class (needs to be called with new)
const urlParams = new URLSearchParams(window.location.search);
const region = urlParams.get("region");


// START QUIZ
function startQuiz(region) {
  // set JSON file for the chosen region
  const citiesFile = `cities/${region}.json`;


  // Map initial center and zoom for each region
  // "python dictionary key:world,france... value: center[longitude, latitude], zoom"
  const regionSettings = {
    world: { center: [0, 20], zoom: 2 },
    france: { center: [2.2137, 46.2276], zoom: 5 },
    spain: { center: [-3.7038, 40.4168], zoom: 5 },
    italy: { center: [12.4964, 41.9028], zoom: 5 }
  };
  const settings = regionSettings[region]


  // Create the interactive map
  // maplibregl.Map is a class provided by the MapLibre library.
  // container: 'map' looks for <div id="map"></div>
  // center: settings.center sets the starting position of the map. (from earlier code)
  // larger numbers = closer zoom
  map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/019a8239-05ae-74c9-835e-bb2308959812/style.json?key=Log0g5gRFj2BYhuEUZho',
    center: settings.center,
    zoom: settings.zoom,
    doubleClickZoom: false
  });

  // Load cities from JSON
  // fetch: finds the file, then downloads and returns the contents
  // .then(): “When the previous thing is done, run this.”
  // res: response object
  // res.json():reads the JSON text and turns it into a real JavaScript array
  // temporarly returns data (as a the array) which we in the first line make cities be equal to
  /* [...]: takes all elements from the cities array and creates a new array 
  with the same items. (remainingCities = cities: Any change to remainingCities 
  would also change the cities variable.*/ 
  // if region is "world": totalQuestions = 30 else totalQuestions = 10
  fetch(citiesFile)
    .then(res => res.json())
    .then(data => {
      cities = data;                     
      remainingCities = [...cities];     
      totalQuestions = region === "world" ? 30 : 10;
      correctCount = 0;
      questionCount = 0;
      sessionEnded = false;
      nextQuestion();   // Start the first question
    });

  // .on() is a method that listens for events (for clicks in this case) on the map
  /* handleMapClick (inbuilt function) receives an event object "e" that contains info 
  about the click including coordinates: console.log(e.lngLat): 
  the longitude and latitude where the user clicked*/
  map.on('click', handleMapClick);
}


// SHOW NEXT QUESTION
function nextQuestion() {
  // Remove the red answer marker if it exists
  if (answerMarker) {
    answerMarker.remove();
    answerMarker = null;
  }

  attempts = 0;           // Reset attempts for new city
  quizLocked = false;     // Allow map clicks again

  // Check if quiz is finished
  if (remainingCities.length == 0) {
    if (!sessionEnded) {
      sessionEnded = true;
      showResetButton();
    }
    document.getElementById('question').textContent = "Quiz Finished!";
    return; // to finish the function so it doesnt try to ask next question
  }

  // Pick a random city from remaining cities
  /* .splice() is an array method that: removes items from an array 
  and returns an array of the removed items like {name: "Paris", lat: 48.8566, lng: 2.3522 } */
  const randomIndex = Math.floor(Math.random() * remainingCities.length);
  currentCity = remainingCities.splice(randomIndex, 1)[0];
  questionCount++;

  // Update score and show the city name
  updateScore();
  document.getElementById('question').textContent = `Find: ${currentCity.name}`;
}

// UPDATE SCORE AND PROGRESS
function updateScore() {
  document.getElementById('score').textContent = `Correct: ${correctCount}/${totalQuestions}`;
  document.getElementById('progress').textContent = `Question: ${questionCount}/${totalQuestions}`;
}

// SHOW RESET BUTTON
function showResetButton() {
  const resetBtn = document.createElement('button');
  resetBtn.textContent = "Try Again";

  // When clicked, restart the quiz
  resetBtn.addEventListener('click', () => {
    remainingCities = [...cities];
    questionCount = 0;
    correctCount = 0;
    sessionEnded = false;
    resetBtn.remove();
    nextQuestion();
  });

  // adds the button to the page inside the quizContainer div, so the user can see it and click it.
  quizContainer.appendChild(resetBtn);
}


// HANDLE MAP CLICKS
function handleMapClick(e) {
  if (quizLocked || sessionEnded) return; // Ignore clicks if locked

  // Get clicked coordinates
  const clickedLngLat = [e.lngLat.lng, e.lngLat.lat];
  const cityLngLat = [currentCity.lng, currentCity.lat];

  // Calculate distance to city
  const distance = getDistance(clickedLngLat, cityLngLat);
  const hitboxRadius = 40000; // 40 km

  if (distance < hitboxRadius) {
    // Correct guess
    if (attempts === 0) correctCount++; // Count only first attempt as correct
    statusEl.style.color = 'green';
    statusEl.textContent = `You found ${currentCity.name}.`;
    nextQuestion();
  } else {
    // Wrong guess
    attempts++;
    statusEl.style.color = 'red';

    if (attempts >= 3) {
      revealCityPin(cityLngLat); // Reveal correct location after 3 wrong attempts
    } else {
      statusEl.textContent = `❌ Wrong! Try again. (${attempts}/3)`;
    }
  }
  updateScore();
}


// CALCULATE DISTANCE BETWEEN TWO POINTS
function getDistance([lng1, lat1], [lng2, lat2]) {
  const earthRadius = 6371000; // in meters

  // Convert degrees to radians
  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const deltaLatRad = toRadians(lat2 - lat1);
  const deltaLngRad = toRadians(lng2 - lng1);

  // Haversine formula
  const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c; // distance in meters
  return distance;
}


// REVEAL CITY PIN AFTER 3 WRONG ATTEMPTS
function revealCityPin(cityLngLat) {
  if (answerMarker) return;

  quizLocked = true;

  // Add red marker to show correct city
  answerMarker = new maplibregl.Marker({ color: 'red' })
  answerMarker.setLngLat(cityLngLat)
  answerMarker.addTo(map);

  statusEl.textContent = `❌ Wrong! The city pin is revealed, click it to continue.`;

  // Clicking the marker removes it and goes to next question
  // { once: true } means the function will run only once, then automatically remove itself
  answerMarker.getElement().addEventListener('click', function onPinClick(ev) {
    ev.stopPropagation(); // stops the clicks from reaching the map listener
    answerMarker.remove();
    answerMarker = null;
    attempts = 0;
    quizLocked = false;
    statusEl.textContent = '';
    nextQuestion();
  }, { once: true });
}


// START QUIZ ON PAGE LOAD
startQuiz(region);
