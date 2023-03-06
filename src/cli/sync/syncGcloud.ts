import { syncArmor } from '@/cli'
import { syncTaskQueue } from './syncTaskQueue'

export const syncGcloud = async () => {
  await syncArmor()
  await syncTaskQueue()
}
