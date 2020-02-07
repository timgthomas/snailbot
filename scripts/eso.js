// Description:
//   Various helpers for The Elder Scrolls Online.
//
// Dependencies:
//   "ical-expander": "^2.0.0"
//   "request": ""
//
// Commands:
//   hubot luxury - Lists this weekend's luxury furnishing items
//   hubot pledges - Lists today's Undaunted pledges
//   hubot set <name> - Searches for crafted sets
//
// Author:
//   Tim G. Thomas <tim@timgthomas.com>

const IcalExpander = require('ical-expander')
const request = require('request')
const sets = require('./eso-sets.json')

const luxuryUrl = 'https://calendar.google.com/calendar/ical/e97ku4olpreln13p1rq43bd6p4%40group.calendar.google.com/public/basic.ics'
const pledgesUrl = 'https://calendar.google.com/calendar/ical/stdv9h2f0amjg8gf6p3ekvsjug%40group.calendar.google.com/public/basic.ics'

let formatSetResponse = set => {
  let res = `**${set.name}**\n`
  res += `• Traits required: ${set.traitsRequired}\n`

  if (set.locations.length === 1) {
    res += `• Location: ${set.locations[0].name} (${set.locations[0].zone})`
  } else {
    res += '• Locations:'
    for (let l of set.locations) {
      res += `\n  - ${l.name} (${l.zone})`
    }
  }

  return res
}

module.exports = robot => {

  robot.respond(/set (.*)/i, msg => {
    let set = msg.match[1]
    let foundSets = sets.filter(x => x.name.toLowerCase().replace('\'', '').indexOf(set.toLowerCase().replace('\'', '')) !== -1)
    if (foundSets.length === 1) {
      msg.reply('I found one set:')
      msg.send(formatSetResponse(foundSets[0]))
    } else if (foundSets.length > 0) {
      msg.reply(`I found ${foundSets.length} sets that match:`)
      for (let set of foundSets) {
        msg.send(formatSetResponse(set))
      }
    } else {
      msg.reply('Sorry, I couldn\'t find any sets that match.')
    }
    msg.finish()
  })

  robot.respond(/luxury/i, msg => {

    request(luxuryUrl, (err, res, body) => {

      if (err) {
        msg.send('Sorry, something went wrong getting this weekend’s luxury items. :(')
        return
      }

      let ical = new IcalExpander({ ics: body })
      let oneDayOfMillis = 24 * 60 * 60 * 1000
      let { occurrences } = ical.between(new Date(), new Date(+new Date() + 5 * oneDayOfMillis))
      if (occurrences.length === 0) {
        msg.send('Nothing available at the moment. Check back again soon!')
        return
      }

      let items = occurrences[0].item.description
      items = items.match(/.+?<br>/gm).map(x => {
        let str = x.replace('<br>', '')
        let split = str.lastIndexOf(' ')
        return { item: str.substring(0, split), price: str.substring(split + 1) }
      })

      msg.send(`This weekend’s luxury items:${items.map(x => '\n• **' + x.item + '**: ' + x.price).join('')}`)

    })

  })

  robot.respond(/pledges\s*(|tomorrow)$/i, msg => {

    let day = msg.match[1];

    request(pledgesUrl, (err, res, body) => {

      if (err) {
        msg.send('Sorry, something went wrong getting today’s pledges. :(')
        return
      }

      let date = day !== 'tomorrow' ? new Date() : new Date(+new Date() + 24 * 60 * 60 * 1000);
      let messageDate = day !== 'tomorrow' ? 'Today' : 'Tomorrow';
      let ical = new IcalExpander({ ics: body })
      let { occurrences } = ical.between(date, date)
      let pledges = occurrences.map(x => ({ summary: x.item.summary, description: x.item.description.trim() }))

      msg.send(`${messageDate}’s pledges are below. We are Undaunted!${pledges.map(x => `\n• **${x.summary}**`).join('')}`)

    })

  })

}
