let map;
let cities = [];
let remainingCities = [];
let currentCity = null;
let answerMarker = null;
let attempts = 0;
let correctCount = 0;
let questionCount = 0;
let quizLocked = false;
let sessionEnded = false;
let totalQuestions = null;

const quizContainer = document.getElementById('quizContainer');
const statusEl = document.getElementById('status');
const backButton = document.getElementById('backButton');

backButton.addEventListener('click', () => {
  window.location.href = "index.html";
});

const urlParams = new URLSearchParams(window.location.search);
const region = urlParams.get("region");

function startQuiz(region) {
  const citiesFile = `city_jsons/${region}.json`;

  const regionSettings = {
    world: { center: [0, 20], zoom: 2 },
    france: { center: [2.2137, 46.2276], zoom: 5 },
    spain: { center: [-3.7038, 40.4168], zoom: 5 },
    italy: { center: [12.4964, 41.9028], zoom: 5 }
  };
  const settings = regionSettings[region];

  map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/019a8239-05ae-74c9-835e-bb2308959812/style.json?key=Log0g5gRFj2BYhuEUZho',
    center: settings.center,
    zoom: settings.zoom,
    doubleClickZoom: false
  });

  fetch(citiesFile)
    .then(response => response.json())
    .then(data => {
      cities = data;
      remainingCities = [...cities];
      totalQuestions = region === "world" ? 30 : 10;
      correctCount = 0;
      questionCount = 0;
      sessionEnded = false;
      nextQuestion();
    });

  map.on('click', handleMapClick);
}

function nextQuestion() {
  if (answerMarker) {
    answerMarker.remove();
    answerMarker = null;
  }

  attempts = 0;
  quizLocked = false;

  if (remainingCities.length == 0) {
    if (!sessionEnded) {
      sessionEnded = true;
      showResetButton();
    }
    document.getElementById('question').textContent = "Quiz Finished!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * remainingCities.length);
  currentCity = remainingCities.splice(randomIndex, 1)[0];
  questionCount++;

  updateScore();
  document.getElementById('question').textContent = `Find: ${currentCity.name}`;
}

function updateScore() {
  document.getElementById('score').textContent = `Correct: ${correctCount}/${totalQuestions}`;
  document.getElementById('progress').textContent = `Question: ${questionCount}/${totalQuestions}`;
}

function showResetButton() {
  const resetBtn = document.createElement('button');
  resetBtn.textContent = "Try Again";

  resetBtn.addEventListener('click', () => {
    remainingCities = [...cities];
    questionCount = 0;
    correctCount = 0;
    sessionEnded = false;
    resetBtn.remove();
    nextQuestion();
  });

  quizContainer.appendChild(resetBtn);
}

function handleMapClick(e) {
  if (quizLocked || sessionEnded) return;

  const clickedLngLat = [e.lngLat.lng, e.lngLat.lat];
  const cityLngLat = [currentCity.lng, currentCity.lat];

  const distance = getDistance(clickedLngLat, cityLngLat);
  const hitboxRadius = 40000;

  if (distance < hitboxRadius) {
    if (attempts === 0) correctCount++;
    statusEl.style.color = 'green';
    statusEl.textContent = `You found ${currentCity.name}.`;
    nextQuestion();
  } else {
    attempts++;
    statusEl.style.color = 'red';

    if (attempts >= 3) {
      revealCityPin(cityLngLat);
    } else {
      statusEl.textContent = `❌ Wrong! Try again. (${attempts}/3)`;
    }
  }
  updateScore();
}

function getDistance([lng1, lat1], [lng2, lat2]) {
  const earthRadius = 6371000;

  function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const deltaLatRad = toRadians(lat2 - lat1);
  const deltaLngRad = toRadians(lng2 - lng1);

  const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function revealCityPin(cityLngLat) {
  if (answerMarker) return;

  quizLocked = true;

  answerMarker = new maplibregl.Marker({ color: 'red' })
  answerMarker.setLngLat(cityLngLat)
  answerMarker.addTo(map);

  statusEl.textContent = `❌ Wrong! The city pin is revealed, click it to continue.`;

  answerMarker.getElement().addEventListener('click', function onPinClick(ev) {
    ev.stopPropagation();
    answerMarker.remove();
    answerMarker = null;
    attempts = 0;
    quizLocked = false;
    statusEl.textContent = '';
    nextQuestion();
  }, { once: true });
}

startQuiz(region);
