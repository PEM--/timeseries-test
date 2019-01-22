const fs = require('fs')

const timeSeries = require('./timeSeries')
const timedEvents = require('./timedEvents')
const { TAU } = require('./constants')

// Parse file
const allTimedEvents = fs
  .readFileSync('./data/data.txt', 'utf-8')
  .split('\n')
  .map((timedEventLine) => {
    const [createdAtText, eventValueText] = timedEventLine.split('\t')
    return timedEvents(parseInt(createdAtText, 10), parseFloat(eventValueText))
  })

// Apply windowing algorithm and displays its values
const COLUMN_SIZE = 12
timeSeries(allTimedEvents)
  .forEach((ts, index) => {
    if (index === 0) {
      // Title
      const title = Object.keys(ts)
        .map(val => String(val).padEnd(COLUMN_SIZE, ' '))
        .join('')
      console.log(title)
      // Separator
      console.log(Array.from(
        Array(COLUMN_SIZE * Object.keys(ts).length).keys(), () => '-'
      ).join(''))
    }
    // Each time serie value
    console.log(
      Object.values(ts)
        .map(val => String(val).padEnd(COLUMN_SIZE, ' '))
        .join('')
    )
  })