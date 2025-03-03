document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".search-container button");

  if (buttons.length < 2) {
    console.error("Search or Clear button not found.");
    return;
  }

  const searchButton = buttons[0];
  const clearButton = buttons[1];
  const searchInput = document.querySelector(".search-container input");

  let travelData = null;

  fetch("travel_recommendation_api.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    })
    .then((data) => {
      travelData = data;
      console.log("Data loaded:", travelData);
    })
    .catch((error) => console.error("Error fetching data:", error));

  function displayRecommendations(query, data) {
    if (!data) {
      console.error("Data is not loaded yet.");
      return;
    }

    const container = document.getElementById("recommendations");
    container.innerHTML = "";

    const filteredResults = getFilteredResults(query, data);

    if (filteredResults.length === 0) {
      container.innerHTML = "<p>No recommendations found for this keyword.</p>";
      return;
    }

    filteredResults.forEach((place) => {
      const card = document.createElement("div");
      card.classList.add("place-card");

      const image = document.createElement("img");
      image.src = `images/${place.imageUrl}`;
      image.alt = place.name;

      const title = document.createElement("h3");
      title.textContent = place.name;

      const description = document.createElement("p");
      description.textContent = place.description;
      description.style.color = "#333";

      card.appendChild(image);
      card.appendChild(title);
      card.appendChild(description);
      container.appendChild(card);
    });
  }

  function getFilteredResults(query, data) {
    const results = [];

    if (query === "country" || query == "countries") {
      data.countries.forEach((country) => {
        country.cities.forEach((city) => {
          results.push(city);
        });
      });
    } else if (query === "temple" || query == "temples") {
      results.push(...data.temples);
    } else if (query === "beach" || query == "beaches") {
      results.push(...data.beaches);
    }

    return results.slice(0, 3);
  }

  function clearResults() {
    const container = document.getElementById("recommendations");
    container.innerHTML = "";
  }

  searchButton.addEventListener("click", () => {
    performSearch();
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchButton.click();
    }
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    clearResults();
  });

  function performSearch() {
    if (!travelData) {
      console.error("Data not loaded yet.");
      return;
    }

    const query = searchInput.value.toLowerCase();
    displayRecommendations(query, travelData);
  }
});
