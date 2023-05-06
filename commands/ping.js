export const name = 'ping'
export const description = 'This is a description.'

export default async function ping(interaction) {
  interaction.reply('pong')
}
