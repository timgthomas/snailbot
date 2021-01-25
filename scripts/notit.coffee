module.exports = (robot) ->
  # used to list everyone snailbot has heard say #notit
  # uncomment for debugging
  # robot.respond /who/, (res) ->
  #   notits = robot.brain.get('NotIts')
  #   if notits? && notits.length > 0
  #     for user in robot.brain.get('NotIts')
  #       res.send user

  robot.respond /wii/, (res) ->
    notits = robot.brain.get('NotIts')
    if notits? && notits.length > 0
      a = []
      for user in notits
        a = a.concat(user)
      res.send "Snailbot says it is: " + res.random a

  robot.hear /#notit/, (res) ->
    # keep track of who has said notit
    notits = robot.brain.get('NotIts')
    if not notits?
      notits = []
    user = res.message.user.name
    nta = 1
    for i in notits
      if i == user
        nta = 0
    if nta == 1
      robot.brain.set 'NotIts', (notits.concat([user])) 

    tits = [ '#hugetits', '#alltitsmatter', '#notits', '#showusyourtits']
    res.send res.random tits