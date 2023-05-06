export default {
  data: {
    name: 'ping',
    description: '.'
  },
  execute: function(interaction) {
    interaction.reply('PONG')
  },
}
