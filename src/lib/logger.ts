import chalk from 'chalk'

export module Logger {
  export const successHex = chalk.hex('#39A845')
  export const warningHex = chalk.hex('#FFC300')
  export const errorHex = chalk.hex('#B5332E')
  export const syncHex = chalk.hex('#3073B7')
  export const whiteHex = chalk.hex('#F6F8F9')
  export const indigoHex = chalk.hex('#273C76')
  export const redHex = chalk.hex('#A73730')

  export const success = async (text: string) => {
    console.log(successHex(text))
  }

  export const warning = async (text: string) => {
    console.log(warningHex(text))
  }

  export const error = async (text: string) => {
    console.log(errorHex(text))
  }

  export const sync = async (text: string) => {
    console.log(syncHex(text))
  }

  export const white = async (text: string) => {
    console.log(whiteHex(text))
  }

  export const skeetAA = async () => {
    const row1SKEE = Logger.successHex('   _____ __ __ ____________')
    const row1T = Logger.warningHex('______')
    const row2SKEE = Logger.successHex('  / ___// //_// ____/ ____/')
    const row2T = Logger.warningHex('_  __/')
    const row3SKEE = Logger.successHex('  \\__ \\/ ,<  / __/ / __/ ')
    const row3T = Logger.warningHex('  / / ')
    const row4SKEE = Logger.successHex(' ___/ / /| |/ /___/ /___ ')
    const row4T = Logger.warningHex(' / /    ')
    const row5SKEE = Logger.successHex('/____/_/ |_/_____/_____/')
    const row5T = Logger.warningHex(' /_/    🛠️🛠️')
    console.log(`${row1SKEE}${row1T}`)
    console.log(`${row2SKEE}${row2T}`)
    console.log(`${row3SKEE}${row3T}`)
    console.log(`${row4SKEE}${row4T}`)
    console.log(`${row5SKEE}${row5T}`)
  }

  export const welcomText = async (appName: string) => {
    const text = `
  ⚡⚡⚡ Buidl GraphQL API for Relay Fast ⚡⚡⚡
  $ cd ${appName}
  $ yarn setup && skeet s
  Go To : http://localhost:4200/graphql`
    console.log(whiteHex(text))
  }

  export const cmText = async () => {
    const text = `
    💃🤝🕺 We Support OpenSource Software Comunities 💃🤝🕺
  Why?  - OpenSouce Software Comunities should be deserved more 💎
  How?  - Incentivize for OpenSource Software Developments 💰
  What? - Solve/Create GitHub Issues as always 🛠️
  Epics Alpha: https://alpha.epics.dev/en/how-it-works/
  `
    console.log(syncHex(text))
  }
}
