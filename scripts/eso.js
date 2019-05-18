const IcalExpander = require('ical-expander')
const request = require('request')

const url = 'https://calendar.google.com/calendar/ical/stdv9h2f0amjg8gf6p3ekvsjug%40group.calendar.google.com/public/basic.ics'

module.exports = robot => {

  robot.hear(/pledges/i, msg => {

    request(url, (err, res, body) => {

      if (err) {
        msg.send('Sorry, something went wrong getting today’s pledges. :(')
        return
      }

      let ical = new IcalExpander({ ics: body })
      let { occurrences } = ical.between(new Date(), new Date())
      let pledges = occurrences.map(x => ({ summary: x.item.summary, description: x.item.description.trim() }))

      msg.send(`Today’s pledges are below. We are Undaunted!${pledges.map(x => '\n• ' + x.summary + ' (' + x.description + ')').join('')}`)

    })

  })

}
