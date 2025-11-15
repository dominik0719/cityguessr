// ---------------------------
// REGION LIST SETUP
// ---------------------------

// Define available regions
const regions = ["World", "France", "Italy", "Spain"];
// Get the HTML element that will hold the region list
const regionListEl = document.getElementById("regionList");

// Ensure "World" is always first in the list
const world = regions.shift(); // remove first element
regions.sort(); // alphabetically sort remaining regions
regions.unshift(world); // add "World" back to the start

// Function to display regions in the UI, optionally filtering by search
function displayRegions(filter = "") {
  // Clear existing list
  regionListEl.innerHTML = "";

  // Filter regions based on search input
  regions
    .filter(r => r.toLowerCase().includes(filter.toLowerCase()))
    .forEach(r => {
      // Create a new list item for each region
      const li = document.createElement("li");
      li.textContent = r;
      li.tabIndex = 0; // Make focusable for keyboard navigation
      li.setAttribute("role", "button"); // Accessibility: treat as a button

      // Click event: navigate to quiz page for the selected region
      li.addEventListener("click", () => {
        window.location.href = `quiz.html?region=${r.toLowerCase()}`;
      });

      // Keyboard accessibility: allow "Enter" key to select
      li.addEventListener("keypress", e => {
        if (e.key === "Enter") li.click();
      });

      // Add list item to the region list
      regionListEl.appendChild(li);
    });
}

// Initial load: display all regions
displayRegions();

// ---------------------------
// SEARCH FILTER
// ---------------------------

// Listen for user input in the search box and filter the list in real-time
document.getElementById("search").addEventListener("input", e => {
  displayRegions(e.target.value);
});

// ---------------------------
// BUTTONS
// ---------------------------

// Open information page when Info button is clicked
document.getElementById("openInfoButton").addEventListener("click", () => {
  window.location.href = "info.html";
});

// Open feedback form when Form button is clicked
document.getElementById("openFormButton").addEventListener("click", () => {
  window.location.href = "form.html";
});
