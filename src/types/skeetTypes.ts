export type SkeetCloudConfig = {
  api: GCPConfig
  workers?: Array<WorkerConfig>
  taskQueues?: Array<TaskQueue>
}

export type DbConfig = {
  databaseVersion: string
  cpu: number
  memory: string
  storageSize: number
  whiteList?: string
}

export type GCPConfig = {
  appName: string
  projectId: string
  region: string
  cloudRun: CloudRunConfig
  db: DbConfig
}

export type WorkerConfig = {
  workerName: string
  cloudRun: CloudRunConfig
}

export type CloudRunConfig = {
  cpu: number
  memory: string
  maxConcurrency: number
  minInstances: number
  maxInstances: number
}

export type TaskQueue = {
  queueName: string
  location: string
  maxAttempts: number
  maxInterval: number
  minInterval: number
  maxConcurrent: number
  maxRate: number
}
