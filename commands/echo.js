export default {
  data: {
    name: 'echo',
    description: 'Replies back with the message you send.',
  },
  execute: function(interaction) {
    console.log('interaction', interaction)
  },
}
