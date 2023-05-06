import { glob } from 'glob'

export default async function getCommands() {
  // NOTE: `glob` defaults its search to `process.cwd`.
  const commandPaths = await glob('./commands/*.js')
  const commandFiles = await Promise.all(commandPaths.map((path) => import(`../${path}`)))
  return commandFiles.map((file) => file.default)
}
