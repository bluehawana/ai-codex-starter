import { spawn } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { readConfig, getCredential } from './storage.js';
import type { Profile } from './types.js';

/**
 * Sanitize environment variables - remove all OPENAI_* vars
 */
export function sanitizeEnvironment(): Record<string, string> {
  const clean: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined && !key.startsWith('OPENAI_')) {
      clean[key] = value;
    }
  }

  return clean;
}

/**
 * Prepare environment for a profile
 * Uses custom env key name if specified, otherwise defaults to OPENAI_API_KEY
 */
export async function prepareEnvironment(
  profile: Profile,
  credential: string
): Promise<Record<string, string>> {
  const env = sanitizeEnvironment();

  // Use custom env key name if specified, otherwise default to OPENAI_API_KEY
  const envKeyName = profile.envKeyName || 'OPENAI_API_KEY';
  env[envKeyName] = credential;

  // Always set OPENAI_BASE_URL for non-OpenAI providers
  // This ensures codex doesn't fall back to OpenAI's API
  if (profile.baseUrl !== 'https://api.openai.com/v1' && envKeyName === 'OPENAI_API_KEY') {
    env['OPENAI_BASE_URL'] = profile.baseUrl;
  }

  return env;
}

/**
 * Execute codex command with profile
 */
export async function executeWithProfile(
  profileName: string | undefined,
  args: string[]
): Promise<void> {
  const config = readConfig();

  // Determine which profile to use
  let targetProfile: Profile | undefined;

  if (profileName) {
    // Profile specified in command line
    targetProfile = config.profiles.find((p) => p.name === profileName);
    if (!targetProfile) {
      console.error(chalk.red(`Profile "${profileName}" not found.`));
      console.log(chalk.yellow('Run "ai-codex-starter list" to see available profiles.'));
      process.exit(1);
    }
  } else {
    // No profile specified, show interactive selection
    if (config.profiles.length === 0) {
      console.error(chalk.red('No profiles configured.'));
      console.log(chalk.yellow('Run "ai-codex-starter setup" to create a profile.'));
      process.exit(1);
    }

    if (config.profiles.length === 1) {
      // Only one profile, use it automatically
      targetProfile = config.profiles[0];
      console.log(chalk.blue(`Using profile: ${chalk.bold(targetProfile.name)}`));
    } else {
      // Multiple profiles, show selection menu
      const { selectedProfile } = await inquirer.prompt<{ selectedProfile: string }>([
        {
          type: 'list',
          name: 'selectedProfile',
          message: 'Select a profile to use:',
          choices: config.profiles.map((p) => ({
            name: p.name === config.defaultProfile
              ? `${p.name} ${chalk.green('(default)')}`
              : p.name,
            value: p.name
          })),
          default: config.defaultProfile
        }
      ]);

      targetProfile = config.profiles.find((p) => p.name === selectedProfile);
      if (!targetProfile) {
        console.error(chalk.red(`Profile "${selectedProfile}" not found.`));
        process.exit(1);
      }
    }
  }

  // Get credential
  const credential = await getCredential(targetProfile.name);
  if (!credential) {
    console.error(
      chalk.red(`No credential found for profile "${targetProfile.name}".`)
    );
    console.log(chalk.yellow('Run "ai-codex-starter setup" to configure credentials.'));
    process.exit(1);
  }

  // Prepare environment
  const env = await prepareEnvironment(targetProfile, credential);

  // Determine command to run
  const cmdIndex = args.indexOf('--cmd');
  let cmdBinary = process.env.CODEX_CMD || (cmdIndex >= 0 ? args[cmdIndex + 1] : 'codex');
  
  // On Windows, add .cmd extension if not already present and not a custom command
  if (process.platform === 'win32' && cmdBinary === 'codex' && !cmdBinary.endsWith('.cmd')) {
    cmdBinary = 'codex.cmd';
  }

  // Filter out --cmd and its value from args
  let codexArgs = args;
  if (cmdIndex >= 0) {
    codexArgs = [...args.slice(0, cmdIndex), ...args.slice(cmdIndex + 2)];
  }

  // Add -c flags for model_provider and model if configured
  // Use -c config overrides instead of --model flag for better compatibility
  const configOverrides: string[] = [];
  
  if (targetProfile.modelProvider) {
    configOverrides.push('-c', `model_provider=${targetProfile.modelProvider}`);
  }
  
  if (targetProfile.model && !codexArgs.includes('--model') && !codexArgs.includes('-m')) {
    configOverrides.push('-c', `model="${targetProfile.model}"`);
  }
  
  // Insert config overrides at the beginning of args
  if (configOverrides.length > 0) {
    codexArgs = [...configOverrides, ...codexArgs];
  }

  console.log(
    chalk.blue(`🚀 Launching with profile: ${chalk.bold(targetProfile.name)}`)
  );
  if (targetProfile.model) {
    console.log(chalk.blue(`   Model: ${targetProfile.model}`));
  }

  // Execute
  // On Windows, use shell: true to properly resolve .cmd files
  // When using shell, we need to properly quote arguments that contain spaces
  let spawnArgs = codexArgs;
  let useShell = process.platform === 'win32';
  
  if (useShell) {
    // Quote arguments that contain spaces
    spawnArgs = codexArgs.map(arg => {
      if (arg.includes(' ') && !arg.startsWith('"')) {
        return `"${arg}"`;
      }
      return arg;
    });
  }
  
  const child = spawn(cmdBinary, spawnArgs, {
    env,
    stdio: 'inherit',
    shell: useShell
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });

  child.on('error', (error) => {
    console.error(chalk.red(`Failed to execute command: ${error.message}`));
    process.exit(1);
  });
}
