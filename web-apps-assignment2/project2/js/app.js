"use strict";

// converts date on rss file into proper format shown on rubric
function dateConverter (daet) {
    var event_date = daet;
    event_date = event_date.replace(event_date.substring(17, 29), '');
    var event_day = event_date.substring(5, 7);
    var event_month = event_date.substring(8, 12);
    event_date = event_date.substring(0, 4)+' '+event_month+' '+event_day+', '+event_date.substring(12, 17);
    event_date = event_date.replace('Mon', 'Monday').replace('Jan', 'January').replace('Feb', 'February');
    event_date = event_date.replace('Mar', 'March').replace('Apr', 'April');
    event_date = event_date.replace('Tue', 'Tuesday').replace('Wed', 'Wednesday').replace('Thu', 'Thursday');
    event_date = event_date.replace('Fri', 'Friday').replace('Sat', 'Saturday').replace('Sun', 'Sunday');
    return event_date;
}

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
      if (filterObj.title) {
        events = filterEvents(events, filterObj.title, titleFilter);
      }
      if (filterObj.startDate) {
        events = filterEvents(events, filterObj.startDate, dateFilter);
      }
      if (filterObj.description) {
        events = filterEvents(events, filterObj.description, descriptionFilter);
      }

      // Generate HTML content
      let events_data = ``;
      events.forEach(item => {
        events_data += `
          <article class="card">
            <img src="${item.querySelector("enclosure").getAttribute("url")}" alt="">
            <h3>${item.querySelector("title").innerHTML}</h3>
            <p>${dateConverter(item.querySelector("start").innerHTML)}</p>
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
  let start = dateConverter(document.getElementById('start').value);
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
  let start = dateConverter(getQueryParam('start'));
  let desc = getQueryParam('desc');

  let filterObj = {
         title,
         startDate: start,
         description: desc
  }

  // Fetch and generate events with the default filter values
  fetchAndGenerateEvents(filterObj);
});

// Fetches and generates events with filters sent to blank
const defaultFilters = {
  title: "",
  startDate: "",
  description: ""
};
fetchAndGenerateEvents(defaultFilters);

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
    if (description.style.display == 'none' || title.style.display == 'none') {
      title.style.display = 'block';
      description.style.display = 'block';
    } else {
      title.style.display = 'none';
      description.style.display = 'none';
    }
  }
});
