import { ApplicationCommandOptionType } from 'discord.js'

export default {
  data: {
    name: 'echo',
    description: 'Replies back with the message you send.',
    options: [
      {
        name: 'message',
        description: '.',
        type: ApplicationCommandOptionType.String,
      },
    ],
  },
  execute: function(interaction) {
    const message = interaction.options.getString('message') ?? 'No message provided'
    interaction.reply(message)
  },
}
