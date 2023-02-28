export type SkeetCloudConfig = {
  api: GCPConfig
  workers?: Array<WorkerConfig>
  taskQueues?: Array<TaskQueue>
  cloudArmor?: CloudArmor
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
  hasLoadBalancer: boolean
  cloudRun: CloudRunConfig
  db: DbConfig
}

export type WorkerConfig = {
  workerName: string
  cloudRun: CloudRunConfig
}

export type CloudRunConfig = {
  name: string
  url: string
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
  maxInterval: string
  minInterval: string
  maxConcurrent: number
  maxRate: number
}

export type CloudArmor = Array<SecurityPolicy>

export type SecurityPolicy = {
  securityPolicyName: string
  rules: [
    {
      priority: string
      description: string
      options: { [key: string]: string }
    }
  ]
}

export enum ArmorAction {
  ALLOW = 'allow',
  DENY1 = 'deny-403',
  DENY2 = 'deny-404',
  DENY3 = 'deny-429',
  DENY4 = 'deny-502',
  REDIRECT = 'redirect',
}
