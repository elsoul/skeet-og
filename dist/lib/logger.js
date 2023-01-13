"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
var Logger;
(function (Logger) {
    Logger.successHex = chalk_1.default.hex('#39A845');
    Logger.warningHex = chalk_1.default.hex('#FFC300');
    Logger.errorHex = chalk_1.default.hex('#B5332E');
    Logger.syncHex = chalk_1.default.hex('#3073B7');
    Logger.whiteHex = chalk_1.default.hex('#F6F8F9');
    Logger.indigoHex = chalk_1.default.hex('#273C76');
    Logger.redHex = chalk_1.default.hex('#A73730');
    Logger.success = async (text) => {
        console.log(Logger.successHex(text));
    };
    Logger.warning = async (text) => {
        console.log(Logger.warningHex(text));
    };
    Logger.error = async (text) => {
        console.log(Logger.errorHex(text));
    };
    Logger.sync = async (text) => {
        console.log(Logger.syncHex(text));
    };
    Logger.white = async (text) => {
        console.log(Logger.whiteHex(text));
    };
    Logger.skeetAA = async () => {
        const row1SKEE = Logger.successHex('   _____ __ __ ____________');
        const row1T = Logger.warningHex('______');
        const row2SKEE = Logger.successHex('  / ___// //_// ____/ ____/');
        const row2T = Logger.warningHex('_  __/');
        const row3SKEE = Logger.successHex('  \\__ \\/ ,<  / __/ / __/ ');
        const row3T = Logger.warningHex('  / / ');
        const row4SKEE = Logger.successHex(' ___/ / /| |/ /___/ /___ ');
        const row4T = Logger.warningHex(' / /    ');
        const row5SKEE = Logger.successHex('/____/_/ |_/_____/_____/');
        const row5T = Logger.warningHex(' /_/    🛠️🛠️');
        console.log(`${row1SKEE}${row1T}`);
        console.log(`${row2SKEE}${row2T}`);
        console.log(`${row3SKEE}${row3T}`);
        console.log(`${row4SKEE}${row4T}`);
        console.log(`${row5SKEE}${row5T}`);
    };
    Logger.welcomText = async (appName) => {
        const text = `
  ⚡⚡⚡ Buidl GraphQL API for Relay Fast ⚡⚡⚡
  $ cd ${appName}
  $ yarn setup && skeet s
  Go To : http://localhost:4200/graphql`;
        console.log(Logger.whiteHex(text));
    };
    Logger.cmText = async () => {
        const text = `
    💃🤝🕺 We Support OpenSource Software Comunities 💃🤝🕺
  Why?  - OpenSouce Software Comunities should be deserved more 💎
  How?  - Incentivization for OpenSource Developments 💰
  What? - Solve/Create GitHub Issues as always 🛠️
  Epics Alpha: https://alpha.epics.dev/en/how-it-works/
  `;
        console.log(Logger.syncHex(text));
    };
})(Logger = exports.Logger || (exports.Logger = {}));
//# sourceMappingURL=logger.js.map