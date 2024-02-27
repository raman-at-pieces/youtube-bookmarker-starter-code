import * as ics from 'ics'

(() => {
   chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { type, tabId } = obj;

      if (type === "toDownload") {
         console.log("Got download message");
         getCurrentSchedule();
      }
   });

   const getCurrentSchedule = () => {
      // The table we want is the fourth on the page
      const scheduleTable = document.getElementsByTagName("table")[4].lastChild
      const rowArr = Array.from(scheduleTable.children)
      rowArr.shift() // removes the top row bc it's the titles

      const firstRow = Array.from(rowArr.shift().children) // process first row of schedule, bc it also contains the sidebar
      firstRow.shift() // removes the sidebar
      // console.log(firstRow) 
   }

   const event = {
      start: [2018, 5, 30, 6, 30],
      duration: { hours: 6, minutes: 30 },
      title: 'Bolder Boulder',
      description: 'Annual 10-kilometer run in Boulder, Colorado',
      location: 'Folsom Field, University of Colorado (finish line)',
      url: 'http://www.bolderboulder.com/',
      geo: { lat: 40.0095, lon: 105.2669 },
      categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
      attendees: [
        { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
        { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
      ]
    }
    
    ics.createEvent(event, (error, value) => {
      if (error) {
        console.log(error)
        return
      }
    
      console.log(value)
    })
})();