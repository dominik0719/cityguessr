// -------------------------
// DOM ELEMENTS
// -------------------------
const form = document.getElementById('feedbackForm');
const rating = document.getElementById('rating');
const ratingValue = document.getElementById('ratingValue');
const backButton = document.getElementById('backButton');

// -------------------------
// INITIALIZE SLIDER
// -------------------------
ratingValue.textContent = rating.value;

rating.addEventListener('input', () => {
  ratingValue.textContent = rating.value;
});

// -------------------------
// BACK TO QUIZZES BUTTON
// -------------------------
backButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// -------------------------
// FORM SUBMISSION
// -------------------------
form.addEventListener('submit', function(e) {
  e.preventDefault();

  let valid = true;
  const messages = [];

  // Name validation
  const name = document.getElementById('name');
  if (!name.value.trim()) {
    valid = false;
    messages.push("Name is required.");
  }

  // Email validation
  const email = document.getElementById('email');
  if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
    valid = false;
    messages.push("Valid email is required.");
  }

  // Age validation
  const age = document.getElementById('age');
  if (!age.value || age.value < 5 || age.value > 120) {
    valid = false;
    messages.push("Valid age (5-120) is required.");
  }

  // Gender validation
  const gender = document.getElementById('gender');
  if (!gender.value) {
    valid = false;
    messages.push("Please select your gender.");
  }

  // Suggestions validation
  const improve = document.getElementById('improve');
  if (!improve.value.trim()) {
    valid = false;
    messages.push("Please give suggestions for improvement.");
  }

  // Difficulty validation
  const difficulty = form.querySelector('input[name="difficulty"]:checked');
  if (!difficulty) {
    valid = false;
    messages.push("Please select difficulty.");
  }

  // Favorite region validation
  const favorite = document.getElementById('favorite');
  if (!favorite.value.trim()) {
    valid = false;
    messages.push("Please enter your favorite region.");
  }

  // Last played validation
  const lastPlayed = document.getElementById('lastPlayed');
  if (!lastPlayed.value) {
    valid = false;
    messages.push("Please select when you last played the quiz.");
  }

  // Rating validation
  if (!rating.value) {
    valid = false;
    messages.push("Please rate the quiz.");
  }

  // Subscribe checkbox validation
  const subscribe = document.getElementById('subscribe');
  if (!subscribe.checked) {
    valid = false;
    messages.push("You must agree to subscribe.");
  }

  // If invalid, show alert
  if (!valid) {
    alert(messages.join("\n"));
    return;
  }

  // Successful submission
  alert("Thank you for your feedback!");
  form.reset();
  ratingValue.textContent = rating.value; // reset slider display
});
