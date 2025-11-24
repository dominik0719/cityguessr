const regions = ["World", "France", "Italy", "Spain"];
const regionListEl = document.getElementById("regionList");

const world = regions.shift();
regions.sort();
regions.unshift(world);

function displayRegions(searchText = "") {
  regionListEl.innerHTML = "";

  const filteredRegions = regions.filter(region => 
    region.toLowerCase().includes(searchText.toLowerCase())
  );

  filteredRegions.forEach(region => {
    const li = document.createElement("li");
    li.textContent = region;
    li.tabIndex = 0;
    li.setAttribute("role", "button");

    li.addEventListener("click", () => {
      window.location.href = `quiz.html?region=${region.toLowerCase()}`;
    });

    li.addEventListener("keypress", e => {
      if (e.key === "Enter") li.click();
    });

    regionListEl.appendChild(li);
  });
}

displayRegions();

document.getElementById("search").addEventListener("input", e => {
  displayRegions(e.target.value);
});

document.getElementById("openInfoButton").addEventListener("click", () => {
  window.location.href = "info.html";
});

document.getElementById("openFormButton").addEventListener("click", () => {
  window.location.href = "form.html";
});
