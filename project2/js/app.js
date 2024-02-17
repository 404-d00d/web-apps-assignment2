"use strict";
// Converts inputted date to have uniform layout
function dateConverter (date) {
  var event_date = date;
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

// Function to fetch RSS file and generate HTML content
function fetchAndGenerateEvents(filterObj) {
  const RSS_File = "events.rss";
  fetch(RSS_File)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const items = data.querySelectorAll("item");
      let events = Array.from(items);
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
      // Generate HTML content for card
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
      const totalPageShowings = events.length;
      const totalEvents = items.length;
      document.getElementById("page-count").textContent = `Showing: ${totalPageShowings} / ${totalEvents}`;
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

//Used in the dataFilter function to go through the inputted date
function parseUserInputDate(input) {
  let parsedDate;
  let dateParts = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);

  // Match patterns like "Jan 30" or "30 Jan"
  if (!parsedDate || isNaN(parsedDate.getTime())) {
    dateParts = input.match(/(\d{1,2})\s*(\w{3})\s*(\d{4})?|(\w{3})\s*(\d{1,2})\s*(\d{4})?/);
    if (dateParts) {
      let day, month, year;
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIndex = monthNames.indexOf(month);

      // Check if month name is valid
      if (monthIndex !== -1) {
        parsedDate = new Date(year, monthIndex, day);
      }
    }
  }

  // If the date is still invalid, attempt ISO date format parsing as a fallback
  if (!parsedDate || isNaN(parsedDate.getTime())) {
    parsedDate = new Date(input);
  }

  // Return the parsed date if valid, otherwise return null
  return parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;
}

// Filter through the cards with date
function dateFilter(events, startDate) {
  if (!startDate) return events;

  // Use parseUserInputDate to get a Date object for the start date
  const userInputDate = parseUserInputDate(startDate);
  if (!userInputDate) return events; // If parsing failed, return all events

  return events.filter(item => {
    const eventDateStr = item.querySelector("start").textContent;
    const eventDate = new Date(eventDateStr);

    // Compare the dates
    return eventDate.setHours(0,0,0,0) === userInputDate.setHours(0,0,0,0);
  });
}

// Function to filter events by description
function descriptionFilter(events, description) {
  if (!description) return events;
  return events.filter(item =>
    item.querySelector("description").innerHTML.toLowerCase().includes(description.trim().toLowerCase())
  );
}

// Event listener for submit button
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
  };

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

  if (target.matches('.toggle-btn')) {
    const card = target.closest('.card');

    // Get the title and description elements
    const title = card.querySelector('.p-name');
    const description = card.querySelector('div p');

    const titleDisplayStyle = window.getComputedStyle(title).display;
    const descriptionDisplayStyle = window.getComputedStyle(description).display;

    // Toggle the display of title and description
    if (titleDisplayStyle === 'none' || descriptionDisplayStyle === 'none') {
      title.style.display = 'block';
      description.style.display = 'block';
    } else {
      title.style.display = 'none';
      description.style.display = 'none';
    }
  }
});
