# Description:
#   Yeah Tim script

module.exports = (robot) ->

  robot.hear /yeah.*tim/i, (res) ->
    re=/beth/i
    if res.message.user.name.match re
      res.send "Don't be a brat, Beth!"
    else
      res.send "Yeah, Tim!"
  