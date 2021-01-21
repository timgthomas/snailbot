# Description:
#   Yeah Tim script

module.exports = (robot) ->

  robot.hear /yeah.*tim/i, (res) ->
    re=/beth/i
    if res.message.user.name.match re
      if Math.random() > 0.1
        res.send "Don't be a brat, Beth!"
      else
        res.send "Yeah, Clark!"
    else
      res.send "Yeah, Tim!"

  robot.hear /yeah\W+clark/i, (res) ->
    res.send ':cricket: :cricket: :cricket:'
