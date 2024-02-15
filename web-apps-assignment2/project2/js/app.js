"use strict";

// Function to fetch RSS feed and generate HTML content
function fetchAndGenerateEvents(filterData) {
  const RSS_File = "events.rss";

  fetch(RSS_File)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const items = data.querySelectorAll("item");
      let events = Array.from(items); // Convert NodeList to array for filtering

      // Apply filters
      events = filterEvents(events, filterData, applyFilters);

      // Generate HTML content
      let events_data = ``;
      events.forEach(item => {
        events_data += `
          <article class="card">
            <img src="${item.querySelector("enclosure").getAttribute("url")}" alt="">
            <h3>${item.querySelector("title").innerHTML}</h3>
            <p>${item.querySelector("start").innerHTML}</p>
            <p>${item.querySelector("location").innerHTML}</p>
            <button class="toggle-btn">Learn More</button>
            <p>${item.querySelector("description").innerHTML.replace(']]>','')}</p>
          </article>
        `;
      });

      // Display filtered events
      document.getElementById("cards-wrapper").innerHTML = events_data;
    })
    .catch(error => {
      console.error("Error fetching and generating events:", error);
    });
}

// Function named filterEvents to accept as input a list of events, a property value, and a filter function,
// and filters the list of events according to the values entered by the user
function filterEvents(events, filterValue, filterFunction) {
  return filterFunction(events, filterValue);
}

// Function to filter events by title
function filterByTitle(events, title) {
  if (!title) return events;
  return events.filter(item =>
    item.querySelector("title").innerHTML.toLowerCase().includes(title.toLowerCase())
  );
}

// Function to filter events by start date
function filterByStart(events, start) {
  if (!start) return events;
  return events.filter(item =>
    item.querySelector("start").innerHTML.toLowerCase().includes(start.toLowerCase())
  );
}

// Function to filter events by description
function filterByDescription(events, desc) {
  if (!desc) return events;
  return events.filter(item =>
    item.querySelector("description").innerHTML.toLowerCase().includes(desc.toLowerCase())
  );
}

// Function to apply filters
function applyFilters(events, filters) {
  let filteredEvents = events;
  const { title, start, desc } = filters;

  if (title) {
    filteredEvents = filterByTitle(filteredEvents, title);
  }
  if (start) {
    filteredEvents = filterByStart(filteredEvents, start);
  }
  if (desc) {
    filteredEvents = filterByDescription(filteredEvents, desc);
  }

  return filteredEvents;
}

// Function to get query parameter value from URL
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Event listener for form submission
document.querySelector('.filter-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the filter values from the form fields
  const title = document.getElementById('title').value;
  const start = document.getElementById('start').value;
  const desc = document.getElementById('desc').value;

  // Fetch and generate events with the updated filter values
  fetchAndGenerateEvents({ title, start, desc });
});

// Initial fetch and generation of events when the page loads
document.addEventListener('DOMContentLoaded', function() {
  const title = getQueryParam('title');
  const start = getQueryParam('start');
  const desc = getQueryParam('desc');

  fetchAndGenerateEvents({ title, start, desc });
});

// Clear filter button resets filters by refreshing page
document.querySelector('.filter-form').addEventListener('reset', function(event) {
  location.reload();
});

// Toggles the bottom two lines to be visible
document.getElementById('cards-wrapper').addEventListener('click', function(event) {
  const target = event.target;

  // Check if the clicked element is the toggle button inside a card
  if (target.matches('.toggle-btn')) {
    // Get the parent card element
    const card = target.closest('.card');

    // Switch between showing the text or hiding it
    const title = card.querySelector('.p-name');
    const description = card.querySelector('div p');
    if (description.style.display == 'none') {
      title.style.display = 'block';
      description.style.display = 'block';
    } else {
      title.style.display = 'none';
      description.style.display = 'none';
    }
  }
});






