//  GLOBAL DATA
// ==============================
let travelData = {};

// ==============================
// SUBMIT BUTTON CONFIRMATION WITH VALIDATION
// ==============================
const submitBtn = document.getElementById("submit");

submitBtn?.addEventListener("click", (e) => {
  e.preventDefault(); // prevent default form submission

  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const message = document.getElementById("message")?.value.trim();

  // check required fields
  if (!name || !email || !message) {
    alert("Please fill all required fields!");
    return;
  }

  //  simple email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address!");
    return;
  }

  // if all validations pass
  alert("Thank you for contacting us 💖!");

  // optionally, clear the form
  document.getElementById("contactForm")?.reset();
});

// ==============================
// BOOK BUTTON CONFIRMATION
// ==============================
const bookBtn = document.getElementById("bookbtn");
bookBtn?.addEventListener("click", (e) => {
    e.preventDefault(); // prevent default if inside a form
    alert("Thank you for booking!");
  });

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


/// ==============================
// SEARCH FUNCTION
// ==============================
function searchKeyword() {
    const input = document.getElementById("placeInput").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("results");
    const searchHeader = document.querySelector(".search-header");
    const homeContent = document.querySelector(".homepage-content");

    // clear previous results
    resultsDiv.innerHTML = "";
    searchHeader.innerText = ""; // clear header
    if (homeContent) homeContent.style.display = "none";

    const addedPlaces = new Set();
    let hasResults = false;

    // Helper to add place if not duplicate
    const addPlace = (place) => {
        if (!addedPlaces.has(place.name)) {
            resultsDiv.appendChild(createCard(place));
            addedPlaces.add(place.name);
            hasResults = true;
        }
    };

    // Keyword search
    if (input === "beach" || input === "beaches") {
        travelData.beaches?.forEach(addPlace);
    } else if (input === "temple" || input === "temples") {
        travelData.temples?.forEach(addPlace);
    } else {
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

    // Show header and results
    if (hasResults) {
        searchHeader.innerText = "Searched Results";
    } else {
        searchHeader.innerText = "";
        resultsDiv.innerHTML = "<p class='no-results'>No results found</p>";
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

