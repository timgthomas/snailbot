import {
  REST as DiscordRestClient,
  Routes,
} from 'discord.js'
import dotenv from 'dotenv'
import getCommands from './lib/get-commands.js'

dotenv.config()
const clientId = process.env.DISCORD_CLIENT_ID
const token = process.env.DISCORD_TOKEN;

(async function publishCommands() {
  const commands = await getCommands()

  console.log(`[setup] publishing commands: ${commands.map(({ data }) => data.name).join(', ')}`)

  await new DiscordRestClient()
    .setToken(token)
    .put(
      Routes.applicationCommands(clientId),
      { body: commands.map(({ data }) => data) },
    )
})()
