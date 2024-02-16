"use strict";

// Select the events display container
const eventsDisplayArea = document.querySelector('.events');

// Parse current URL parameters for filters
const queryParams = new URLSearchParams(window.location.search);

// Log current URL parameters for debugging
console.log(queryParams);
const searchFilters = {
  'title': queryParams.get('title'),
  'date': queryParams.get('start'),
  'description': queryParams.get('desc'),
};
console.log(searchFilters.title);

// Function to filter events by title
function filterEventsByTitle(eventArray, filterCriteria) {
  let titleFilteredEvents = [];

  if (!searchFilters.title) {
    return eventArray;
  }

  document.querySelector('input[name="title"]').value = searchFilters.title;
  eventArray.forEach(singleEvent => {
    if (singleEvent.querySelectorAll('title')[0].innerHTML.toLowerCase().includes(filterCriteria.title.toLowerCase())) {
      titleFilteredEvents.push(singleEvent);
    }
  });
  return titleFilteredEvents;
}

// Function to filter events by date
/*
function filterEventsByDate(eventArray, filterCriteria) {
  let dateFilteredEvents = [];

  if (!searchFilters.date) {
    return eventArray;
  }

  document.querySelector('input[name="start"]').value = searchFilters.date;
  eventArray.forEach(singleEvent => {
    if (singleEvent.querySelectorAll('start')[0].innerHTML.toLowerCase().includes(filterCriteria.date.toLowerCase())) {
      dateFilteredEvents.push(singleEvent);
    }
  });
  return dateFilteredEvents;
}
*/
// Function to filter events by date
/*function filterEventsByDate(eventArray, filterCriteria) {
  let dateFilteredEvents = [];

  if (!searchFilters.date) {
    return eventArray;
  }

  // Assuming the input date is in the format "MM/DD/YYYY"
  const inputDateValue = searchFilters.date; // e.g., "02/02/2022"
  document.querySelector('input[name="start"]').value = inputDateValue;

  // Parse the input date string into a Date object
  const [month, day, year] = inputDateValue.split('/');
  const inputDate = new Date(`${year}-${month}-${day}T00:00:00`);

  eventArray.forEach(singleEvent => {
    // Extract and parse the event's date from the innerHTML
    let eventDateHTML = singleEvent.querySelectorAll('start')[0].innerHTML;
    let eventDate = new Date(eventDateHTML);

    // Format the event's date to "MM/DD/YYYY" for comparison
    let eventDateFormatted = (eventDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
      eventDate.getDate().toString().padStart(2, '0') + '/' +
      eventDate.getFullYear();

    // Compare the formatted event date string with the input date string
    if (eventDateFormatted === inputDateValue) {
      dateFilteredEvents.push(singleEvent);
    }
  });

  return dateFilteredEvents;
}*/
// Helper function to try parsing multiple date formats

// Function to attempt to parse a date string in various formats


// here is the date update function
/*function parseUserInputDate(input) {
  // Try parsing with the expected formats
  const formatsToTry = ["M/D/YYYY", "D MMM YYYY"];
  let parsedDate;

  for (const format of formatsToTry) {
    parsedDate = moment(input, format, true);
    if (parsedDate.isValid()) {
      return parsedDate.toDate();
    }
  }
  return null; // Return null if none of the formats matched
}

// Function to filter events by date
function filterEventsByDate(eventArray, filterCriteria) {
  let dateFilteredEvents = [];

  if (!searchFilters.date) {
    return eventArray;
  }

  // Attempt to parse the user input date
  const userInputDate = parseUserInputDate(searchFilters.date);
  if (!userInputDate) {
    console.error('Invalid date format provided by user.');
    return eventArray;
  }

  // Set the input value for the date filter field
  document.querySelector('input[name="start"]').value = searchFilters.date;

  eventArray.forEach(singleEvent => {
    let eventDateStr = singleEvent.querySelectorAll('start')[0].innerHTML;
    let eventDate = new Date(eventDateStr);

    // Check if the event date matches the user input date
    if (eventDate.toDateString() === userInputDate.toDateString()) {
      dateFilteredEvents.push(singleEvent);
    }
  });

  return dateFilteredEvents;
}*/
// Function to attempt to parse a date string in various formats
function parseUserInputDate(input) {
  let parsedDate;

  // Match patterns like "30/01/2024" or "01/30/2024"
  let dateParts = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dateParts) {
    // Determine if the first part is the day or month
    // This will depend on the expected date format for your users
    // Here, we'll assume "DD/MM/YYYY" for the example
    const day = parseInt(dateParts[1], 10);
    const month = parseInt(dateParts[2], 10) - 1; // Adjust for zero-indexed months
    const year = parseInt(dateParts[3], 10);

    parsedDate = new Date(year, month, day);
  }

  // Match patterns like "Jan 30" or "30 Jan"
  if (!parsedDate || isNaN(parsedDate.getTime())) {
    dateParts = input.match(/(\d{1,2})\s*(\w{3})\s*(\d{4})?|(\w{3})\s*(\d{1,2})\s*(\d{4})?/);
    if (dateParts) {
      let day, month, year;

      if (dateParts[1] && dateParts[2]) { // This is the DD MMM YYYY or DD MMM format
        day = parseInt(dateParts[1], 10);
        month = dateParts[2];
        year = dateParts[3] ? parseInt(dateParts[3], 10) : new Date().getFullYear();
      } else if (dateParts[4] && dateParts[5]) { // This is the MMM DD format
        day = parseInt(dateParts[5], 10);
        month = dateParts[4];
        year = dateParts[6] ? parseInt(dateParts[6], 10) : new Date().getFullYear();
      }

      // Convert month name to month number
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


// Function to filter events by date
function filterEventsByDate(eventArray, filterCriteria) {
  let dateFilteredEvents = [];

  if (!searchFilters.date) {
    return eventArray;
  }

  // Attempt to parse the user input date
  const userInputDate = parseUserInputDate(searchFilters.date);
  if (!userInputDate) {
    console.error('Invalid date format provided by user.');
    return eventArray;
  }

  // Set the input value for the date filter field
  document.querySelector('input[name="start"]').value = searchFilters.date;

  eventArray.forEach(singleEvent => {
    let eventDateStr = singleEvent.querySelectorAll('start')[0].innerHTML;
    let eventDate = new Date(eventDateStr);

    // Check if the event date matches the user input date
    if (eventDate.setHours(0,0,0,0) === userInputDate.setHours(0,0,0,0)) {
      dateFilteredEvents.push(singleEvent);
    }
  });

  return dateFilteredEvents;
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('clearFiltersButton').addEventListener('click', clearFiltersAndReloadData);
});
function clearFiltersAndReloadData() {
  // Clear the input fields
  document.querySelector('#title').value = '';
  document.querySelector('#desc').value = '';
  document.querySelector('#start').value = '';

  // Optionally, if you need to reset any other state or UI elements, do it here

  // Call the function to fetch and display all events (assuming this function exists)
  fetchAndDisplayEvents();
}
function fetchAndDisplayEvents() {
  fetch('data/events.rss')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Get the response body as text
    })
    .then(str => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, "application/xml");
      displayEvents(xmlDoc); // Function to process and display events
    })
    .catch(error => console.error('Failed to fetch events:', error));
}



// Function to filter events by description
function filterEventsByDescription(eventArray, filterCriteria) {
  let descriptionFilteredEvents = [];

  if (!searchFilters.description) {
    return eventArray;
  }

  document.querySelector('input[name="desc"]').value = searchFilters.description;
  eventArray.forEach(singleEvent => {
    if (singleEvent.querySelectorAll('description')[0].innerHTML.toLowerCase().includes(filterCriteria.description.toLowerCase())) {
      descriptionFilteredEvents.push(singleEvent);
    }
  });
  return descriptionFilteredEvents;
}

// Async function to apply selected filters to the events
const processEventFilters = async (eventsToFilter, filters, filteringFunction) => {
  return await filteringFunction(eventsToFilter, filters);
};

// Fetch event data
const dataFetchUrl = new Request('data/events.rss');
let eventCount = 0;

fetch(dataFetchUrl)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))

  .then(xml => {
    eventCount = xml.querySelectorAll("item").length;
    return xml.querySelectorAll("item");
  })

  .then(items => processEventFilters(items, searchFilters, filterEventsByTitle))
  .then(items => processEventFilters(items, searchFilters, filterEventsByDate))
  .then(items => processEventFilters(items, searchFilters, filterEventsByDescription))
  .then(finalEvents => {
    finalEvents.forEach(eventData => {
      const eventBlock = document.createElement('article');
      eventBlock.classList.add('event-item');

      // Construct and append elements for each event
      const eventVisual = document.createElement('img');
      let imageSrc = 'img/download.jpeg'; // Assuming a default placeholder image

      if (eventData.querySelectorAll('enclosure').length) {
        imageSrc = eventData.querySelectorAll('enclosure')[0].getAttribute('url');
      }
      eventVisual.src = imageSrc;
      eventBlock.appendChild(eventVisual);

      const eventHeadline = document.createElement('h4');
      eventHeadline.classList.add('event-title');
      eventHeadline.textContent = eventData.querySelectorAll('title')[0].innerHTML;
      eventBlock.appendChild(eventHeadline);

      let eventTiming = new Date(eventData.querySelectorAll('start')[0].innerHTML);
      const eventSchedule = document.createElement('p');
      eventSchedule.classList.add('event-date');
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timezone: 'EST', timeZoneName: 'short' };
      eventSchedule.textContent = eventTiming.toLocaleDateString('en-US', dateOptions);
      eventBlock.appendChild(eventSchedule);

      const eventLocale = document.createElement('p');
      eventLocale.classList.add('event-location');
      eventLocale.textContent = eventData.querySelectorAll('location')[0].innerHTML;
      eventBlock.appendChild(eventLocale);

      const detailsButton = document.createElement('button');
      detailsButton.classList.add('learn-more-button');
      detailsButton.textContent = 'Learn more';
      eventBlock.appendChild(detailsButton);

      detailsButton.onclick = function() {
        const detailedInfo = this.parentElement.querySelector('.event-description');
        detailedInfo.classList.toggle('hidden');
      };

      const eventDetails = document.createElement('p');
      eventDetails.classList.add('event-description', 'hidden');
      eventDetails.innerHTML = eventData.querySelectorAll('description')[0].innerHTML.replace(']]>','');
      eventBlock.appendChild(eventDetails);

      eventsDisplayArea.appendChild(eventBlock);
    });

    if (finalEvents.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.classList.add('no-items-found');
      emptyMessage.textContent = 'No events found.';
      eventsDisplayArea.appendChild(emptyMessage);
    }

    document.querySelector('.results-count').textContent = `Displayed: ${finalEvents.length} out of ${eventCount}`;
  })
  .catch((error) => {
    console.error('Error fetching event data:', error);
  });
