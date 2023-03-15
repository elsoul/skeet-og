export type PluginParam = {
  id: number
  name: string
  port: number
}
export const skeetWorkerPluginList: Array<PluginParam> = [
  {
    id: 1,
    name: 'solana-transfer',
    port: 1112,
  },
  {
    id: 2,
    name: 'orca-swap',
    port: 1113,
  },
  {
    id: 3,
    name: 'jupiter-swap',
    port: 1114,
  },
]
