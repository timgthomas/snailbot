import { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()
const clientId = process.env.DISCORD_CLIENT_ID
const token = process.env.DISCORD_TOKEN

const client = new Client({ intents: [ GatewayIntentBits.Guilds ] })

const testCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('.'),
  execute: ({ reply }) => {
    reply('pong!')
  },
}

client.once('ready', async (e) => {
  console.log(`Ready! Logged in as ${e.user.tag}`)

  await new REST().setToken(token).put(
    Routes.applicationCommands(clientId),
    { body: [ testCommand.data.toJSON() ] },
  )
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return

  console.log('interaction', interaction)

	const command = testCommand // interaction.client.commands.get(interaction.commandName)

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`)
		return
	}

	try {
		await command.execute.call(interaction, { reply: interaction.reply.bind(interaction) })
	} catch (error) {
		console.error(error)
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
})

client.login(token)
