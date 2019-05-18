const IcalExpander = require('ical-expander')
const request = require('request')

const luxuryUrl = 'https://calendar.google.com/calendar/ical/e97ku4olpreln13p1rq43bd6p4%40group.calendar.google.com/public/basic.ics'
const pledgesUrl = 'https://calendar.google.com/calendar/ical/stdv9h2f0amjg8gf6p3ekvsjug%40group.calendar.google.com/public/basic.ics'

module.exports = robot => {

  robot.hear(/luxury/i, msg => {

    request(luxuryUrl, (err, res, body) => {

      if (err) {
        msg.send('Sorry, something went wrong getting this weekend’s luxury items. :(')
        return
      }

      let ical = new IcalExpander({ ics: body })
      // TODO: If it's not a weekend today, grab the following weekend's goods.
      let { occurrences } = ical.between(new Date(), new Date())
      if (occurrences.length === 0) {
        msg.send('Nothing available at the moment. Check back again soon!')
        return
      }

      let items = occurrences[0].item.description
      items = items.match(/^.*\d+,\d+g$/gm).map(x => {
        let split = x.lastIndexOf(' ')
        return { item: x.substring(0, split), price: x.substring(split + 1) }
      })

      msg.send(`This weekend’s luxury items:${items.map(x => '\n• **' + x.item + '**: ' + x.price).join('')}`)

    })

  })

  robot.hear(/pledges/i, msg => {

    request(pledgesUrl, (err, res, body) => {

      if (err) {
        msg.send('Sorry, something went wrong getting today’s pledges. :(')
        return
      }

      let ical = new IcalExpander({ ics: body })
      let { occurrences } = ical.between(new Date(), new Date())
      let pledges = occurrences.map(x => ({ summary: x.item.summary, description: x.item.description.trim() }))

      msg.send(`Today’s pledges are below. We are Undaunted!${pledges.map(x => '\n• **' + x.summary + '** (' + x.description + ')').join('')}`)

    })

  })

}
