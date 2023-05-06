import { glob } from 'glob'

export default async function* getCommands() {
  // NOTE: `glob` defaults its search to `process.cwd`.
  const commandPaths = await glob('./commands/*.js')
  for (const path of commandPaths) {
    const file = await import(`../${path}`)
    yield {
      name: file.name,
      description: file.description,
      execute: file.default,
    }
  }
}
