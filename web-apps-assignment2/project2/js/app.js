"use strict";

// Function to fetch RSS feed and generate HTML content
function fetchAndGenerateEvents(filterObj) {
  const RSS_File = "events.rss";

  fetch(RSS_File)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const items = data.querySelectorAll("item");
      let events = Array.from(items); // Convert NodeList to array for filtering

      // Apply filters
      let filteredByTitle = filterEvents(events, filterObj.title, titleFilter);
      let filteredByDesc = filterEvents(events, filterObj.description, descriptionFilter);
      let filteredByDate = filterEvents(events, filterObj.startDate, dateFilter);

      // Generate HTML content
      let events_data = ``;
      [filteredByTitle, filteredByDesc, filteredByDate].forEach(filteredEvents => {
        filteredEvents.forEach(item => {
          events_data += `
            <article class="card">
              <img src="${item.querySelector("enclosure").getAttribute("url")}" alt="">
              <h3>${item.querySelector("title").innerHTML}</h3>
              <p>${item.querySelector("start").innerHTML}</p>
              <p>${item.querySelector("location").innerHTML}</p>
              <button class="toggle-btn">Learn More</button>
              <p>${item.querySelector("description").innerHTML}</p>
            </article>
          `;
        });
      });

      // Display filtered events
      document.getElementById("cards-wrapper").innerHTML = events_data;
    })
    .catch(error => {
      console.error("Error fetching and generating events:", error);
    });
}

// Function to filter events
function filterEvents(events, filterValue, filterFunction) {
  return filterFunction(events, filterValue);
}

// Function to filter events by title
function titleFilter(events, title) {
  if (!title) return events;
  return events.filter(item =>
    item.querySelector("title").innerHTML.toLowerCase().includes(title.trim().toLowerCase())
  );
}

// Function to filter events by start date
function dateFilter(events, startDate) {
  if (!startDate) return events;
  return events.filter(item =>
    item.querySelector("start").innerHTML.toLowerCase().includes(startDate.trim().toLowerCase())
  );
}

// Function to filter events by description
function descriptionFilter(events, description) {
  if (!description) return events;
  return events.filter(item =>
    item.querySelector("description").innerHTML.toLowerCase().includes(description.trim().toLowerCase())
  );
}

// Event listener for form submission
document.querySelector('.filter-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the filter values from the form fields
  let title = document.getElementById('title').value;
  let start = document.getElementById('start').value;
  let desc = document.getElementById('desc').value;

  let filterObj = {
           title,
           startDate: start,
           description: desc
    }

  // Fetch and generate events with the updated filter values
  fetchAndGenerateEvents(filterObj);
});

// Initial fetch and generation of events when the page loads
document.addEventListener('DOMContentLoaded', function() {
  let title = getQueryParam('title');
  let start = getQueryParam('start');
  let desc = getQueryParam('desc');

  let filterObj = {
         title,
         startDate: start,
         description: desc
  }

  // Fetch and generate events with the default filter values
  fetchAndGenerateEvents(filterObj);
});









