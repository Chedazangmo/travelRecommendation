// ==============================
//  GLOBAL DATA
// ==============================
let travelData = {};

// ==============================
// FETCH JSON DATA
// ==============================
async function fetchTravelData() {
  try {
    const response = await fetch("travel_recommendation_api.json");
    travelData = await response.json();
    console.log("Travel data loaded:", travelData);
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}
fetchTravelData();

// ==============================
//  LOCAL TIME FUNCTION
// ==============================
function getLocalTime(timeZone) {
  return new Date().toLocaleTimeString("en-US", {
    timeZone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}

// ==============================
// CREATE DESTINATION CARD
// ==============================
function createCard(place) {
  const card = document.createElement("div");
  card.classList.add("destination-card");

  const timeHTML = place.timeZone
    ? `<p><strong>Local Time:</strong> 
        <span class="time" data-timezone="${place.timeZone}">${getLocalTime(place.timeZone)}</span>
       </p>`
    : "";

  card.innerHTML = `
    <img src="${place.imageUrl}" alt="${place.name}">
    <div class="destination-card-content">
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      ${timeHTML}
    </div>
  `;

  return card;
}

// ==============================
// SEARCH FUNCTION
// ==============================
function searchKeyword() {
  const input = document.getElementById("placeInput").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("results");
  const homeContent = document.querySelector(".homepage-content");

  resultsDiv.innerHTML = "";
  if (homeContent) homeContent.style.display = "none";

  const addedPlaces = new Set();

  // Helper to add place if not duplicate
  const addPlace = (place) => {
    if (!addedPlaces.has(place.name)) {
      resultsDiv.appendChild(createCard(place));
      addedPlaces.add(place.name);
    }
  };

  //  Keyword search
  if (input === "beach" || input === "beaches") {
    travelData.beaches?.forEach(addPlace);
  } else if (input === "temple" || input === "temples") {
    travelData.temples?.forEach(addPlace);
  } 
  // Country & City search
  else {
    travelData.countries?.forEach((country) => {
      if (country.name.toLowerCase().includes(input)) {
        country.cities?.forEach(addPlace);
      } else {
        country.cities?.forEach((city) => {
          if (city.name.toLowerCase().includes(input)) addPlace(city);
        });
      }
    });
  }

  if (resultsDiv.innerHTML === "") {
    resultsDiv.innerHTML = "<p>No results found</p>";
  }
}

// ==============================
// CLEAR FUNCTION
// ==============================
function clearSearch() {
  const resultsDiv = document.getElementById("results");
  const homeContent = document.querySelector(".homepage-content");

  resultsDiv.innerHTML = "";
  if (homeContent) homeContent.style.display = "block";
  document.getElementById("placeInput").value = "";
}

// ==============================
//  EVENT LISTENERS
// ==============================
document.getElementById("btnSearch")?.addEventListener("click", searchKeyword);
document.getElementById("clear")?.addEventListener("click", clearSearch);

// ==============================
//  LIVE TIME UPDATE
// ==============================
setInterval(() => {
  document.querySelectorAll(".time").forEach((el) => {
    const tz = el.dataset.timezone;
    el.innerText = getLocalTime(tz);
  });
}, 1000);