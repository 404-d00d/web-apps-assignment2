

"use strict";
// ten = 10 // use strict works







// get the main container where articles are loaded
const eventsContainer = document.querySelector('.events');


const urlParams = new URLSearchParams(window.location.search);

console.log(urlParams)
let filterData = {
  'title': urlParams.get('title'),
  'start': urlParams.get('start'),
  'desc': urlParams.get('desc'),
};
console.log(filterData.title)



// create filter functions
function filterByTitle(events, filterValue) {
  let results = [];

  if(!filterData.title) {
    return events;
  }

  document.querySelector('input[name="title"]').value = filterData.title
  events.forEach((event, i) => {
    if(event.querySelectorAll('title')[0].innerHTML.toLowerCase().indexOf(filterValue.title.toLowerCase()) != -1) {
      results.push(event);
    }
  })
  return results;
}

function filterByDate(events, filterValue) {
  let results = [];

  if(!filterData.start) {
    return events;
  }

  document.querySelector('input[name="start"]').value = filterData.start
  events.forEach((event, i) => {
    if(event.querySelectorAll('start')[0].innerHTML.toLowerCase().indexOf(filterValue.start.toLowerCase()) != -1) {
      results.push(event);
    }
  })
  return results;
}


function filterByDesc(events, filterValue) {
  let results = [];

  if(!filterData.desc) {
    return events;
  }

  document.querySelector('input[name="desc"]').value = filterData.desc
  events.forEach((event, i) => {
    if(event.querySelectorAll('description')[0].innerHTML.toLowerCase().indexOf(filterValue.desc.toLowerCase()) != -1) {
      results.push(event);
    }
  })
  return results;
}


const filterEvents = async (events, filterValue, filterFunction) => {
  return await filterFunction(events, filterValue)
}

// fetch data from server
const url = new Request('data/events.rss');
let totalEvents = 0;
// const url = 'events.rss';
fetch(url)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    totalEvents = data.querySelectorAll("item").length;
    return data.querySelectorAll("item");
  })
  .then(events => filterEvents(events, filterData, filterByTitle))
  .then(events => filterEvents(events, filterData, filterByDate))
  .then(events => filterEvents(events, filterData, filterByDesc))
  .then(events => {
    // console.log(events)

    for (const event of events) {

      // let imageItem = event.querySelectorAll('enclosure')[0].outerHTML
      // console.log(event.querySelectorAll('description')[0].innerHTML)
      // console.log(event.querySelectorAll('enclosure')[0].getAttribute('url'))
      // console.log(imageItem.querySelectorAll("url"))

      // create an article element
      let eventItem = document.createElement('article');
      eventItem.classList.add('event-item');


      // add an image element
      let eventImage = document.createElement('img');
      let imageUrl = 'images/placeholder.png';

      if(event.querySelectorAll('enclosure').length) {
        imageUrl = event.querySelectorAll('enclosure')[0].getAttribute('url');
      }
      eventItem.appendChild(eventImage).src = imageUrl;

      // add event title
      let eventTitle = document.createElement('h4');
      eventTitle.classList.add('event-title');
      eventTitle.textContent = event.querySelectorAll('title')[0].innerHTML;
      eventItem.appendChild(eventTitle);



      // add event time
      let date = new Date(event.querySelectorAll('start')[0].innerHTML);

      let dateItem = document.createElement('p');
      dateItem.classList.add('event-date');

      let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timezone: 'EST', timeZoneName: 'short' };
      dateItem.textContent = date.toLocaleDateString('en-US', options)

      eventItem.appendChild(dateItem);


      // add location
      let locationItem = document.createElement('p');
      locationItem.classList.add('event-location');
      locationItem.textContent = event.querySelectorAll('location')[0].innerHTML

      eventItem.appendChild(locationItem);


      // add toggle button
      let eventButton = document.createElement('button');
      eventButton.classList.add('learn-more-button');
      eventButton.textContent = 'Learn more';
      eventItem.appendChild(eventButton);

      eventButton.addEventListener('click', function() {

        let item = this.parentElement.querySelector('.event-description');
        item.classList.toggle('hidden')


      });


      // add description
      let descItem = document.createElement('p');
      descItem.classList.add('event-description');
      descItem.classList.add('hidden');
      descItem.innerHTML = event.querySelectorAll('description')[0].innerHTML

      eventItem.appendChild(descItem);


      eventsContainer.appendChild(eventItem);
    }


    if(events.length == 0) {
      let noItem = document.createElement('p');
      noItem.classList.add('no-items-found');
      noItem.innerHTML = 'No events found.';

      eventsContainer.appendChild(noItem);
    }


    document.querySelector('.results-count').innerHTML = `Showing: ${events.length}/${totalEvents} events`



  })
  .catch((error) => {
    console.log(error);
  });




