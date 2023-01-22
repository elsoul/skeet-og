import { spawnSync } from 'child_process'

export const execSyncCmd = async (
  command: Array<string>,
  cwd: string = '.'
) => {
  const result = spawnSync(command[0], command.slice(1), {
    cwd,
    stdio: 'inherit',
  })
  const output = result.stderr
  console.log(output)
}
