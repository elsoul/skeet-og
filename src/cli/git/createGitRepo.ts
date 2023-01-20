import { execSyncCmd } from '@/lib/execSyncCmd'

export const createGitRepo = async (
  repoName: string,
  openSource: boolean = false
) => {
  const publishType = openSource == true ? 'public' : 'private'

  const cmdLine = [
    'gh',
    'repo',
    'create',
    repoName,
    `--${publishType}`,
    '--push',
    '--souce=./',
    '--remote=upstream',
  ]
  await execSyncCmd(cmdLine)
}
