import Dotenv from "dotenv";
import { Command } from "commander";
const program = new Command();

Dotenv.config();

async function run() {
	console.log("running skeet!");
}

async function create() {
	console.log("creating skeet!");
}

async function main() {
	program.command("run").action(run);
	program.command("create").action(create);
	await program.parseAsync(process.argv);
}

main();
