import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js'
import dotenv from 'dotenv'
import getCommands from './lib/get-commands.js'

dotenv.config()
const clientId = process.env.DISCORD_CLIENT_ID
const token = process.env.DISCORD_TOKEN

const client = new Client({ intents: [ GatewayIntentBits.Guilds ] })

client.once(Events.ClientReady, async (e) => {
  console.log(`Ready! Logged in as ${e.user.tag}`)

  client.commands = []

  for await (const command of getCommands()) {
    client.commands[command.data.name] = command
  }

  const commandsJson = Object.values(client.commands).map(({ data }) => data)

  await new REST().setToken(token).put(
    Routes.applicationCommands(clientId),
    { body: commandsJson },
  )
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands[interaction.commandName]

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute.call(interaction, { reply: interaction.reply.bind(interaction) })
    console.log(`[command] handled command: ${interaction.commandName}`)
  } catch (error) {
    console.error(`[command] error handling command: ${interaction.commandName} (${error})`)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  }
})

client.login(token)
