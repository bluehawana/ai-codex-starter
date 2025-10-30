#!/usr/bin/env node

import { Command } from 'commander';
import { setupCommand, listCommand, setDefaultCommand, deleteCommand, doctorCommand } from './commands.js';
import { executeWithProfile } from './executor.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .name('ai-codex-starter')
  .description('Multi-profile OpenAI-compatible CLI launcher')
  .version(packageJson.version);

program
  .command('setup')
  .description('Create or update a profile')
  .action(async () => {
    await setupCommand();
  });

program
  .command('list')
  .description('List all configured profiles')
  .action(async () => {
    await listCommand();
  });

program
  .command('default <name>')
  .description('Set default profile')
  .action(async (name: string) => {
    await setDefaultCommand(name);
  });

program
  .command('delete <name>')
  .description('Delete a profile')
  .action(async (name: string) => {
    await deleteCommand(name);
  });

program
  .command('doctor')
  .description('Check system health')
  .action(async () => {
    await doctorCommand();
  });

// Parse arguments
const args = process.argv.slice(2);

// Check if it's a subcommand
const subcommands = ['setup', 'list', 'default', 'delete', 'doctor', '--help', '-h', '--version', '-V'];
const isSubcommand = args.length > 0 && subcommands.includes(args[0]);

if (isSubcommand) {
  // Let commander handle subcommands
  program.parse(process.argv);
} else {
  // Direct execution - treat first arg as profile name (if not a flag)
  const profileName = args.length > 0 && !args[0].startsWith('--') ? args[0] : undefined;
  const executionArgs = profileName ? args.slice(1) : args;

  executeWithProfile(profileName, executionArgs).catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
