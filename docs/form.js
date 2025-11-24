const form = document.getElementById('feedbackForm');
const rating = document.getElementById('rating');
const ratingValue = document.getElementById('ratingValue');
const backButton = document.getElementById('backButton');

ratingValue.textContent = rating.value;

rating.addEventListener('input', () => {
  ratingValue.textContent = rating.value;
});

backButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});

form.addEventListener('submit', function(e) {
  e.preventDefault();

  let valid = true;
  const messages = [];

  const name = document.getElementById('name');
  if (!name.value.trim()) {
    valid = false;
    messages.push("Name is required.");
  }

  const email = document.getElementById('email');
  if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
    valid = false;
    messages.push("Valid email is required.");
  }

  const age = document.getElementById('age');
  if (!age.value || age.value < 5 || age.value > 120) {
    valid = false;
    messages.push("Valid age (5-120) is required.");
  }

  const gender = document.getElementById('gender');
  if (!gender.value) {
    valid = false;
    messages.push("Please select your gender.");
  }

  const improve = document.getElementById('improve');
  if (!improve.value.trim()) {
    valid = false;
    messages.push("Please give suggestions for improvement.");
  }

  const difficulty = form.querySelector('input[name="difficulty"]:checked');
  if (!difficulty) {
    valid = false;
    messages.push("Please select difficulty.");
  }

  const favorite = document.getElementById('favorite');
  if (!favorite.value.trim()) {
    valid = false;
    messages.push("Please enter your favorite region.");
  }

  const lastPlayed = document.getElementById('lastPlayed');
  if (!lastPlayed.value) {
    valid = false;
    messages.push("Please select when you last played the quiz.");
  }

  if (!rating.value) {
    valid = false;
    messages.push("Please rate the quiz.");
  }

  const subscribe = document.getElementById('subscribe');
  if (!subscribe.checked) {
    valid = false;
    messages.push("You must agree to subscribe.");
  }

  if (!valid) {
    alert(messages.join("\n"));
    return;
  }

  alert("Thank you for your feedback!");
  form.reset();
  ratingValue.textContent = rating.value;
});
