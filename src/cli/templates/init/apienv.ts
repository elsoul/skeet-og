export const apiEnv = async (appName: string) => {
  const filePath = `${appName}/apps/api/.env`
  const body = `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/skeet-${appName}-dev?schema=public
NO_PEER_DEPENDENCY_CHECK=1`
  return {
    filePath,
    body,
  }
}
