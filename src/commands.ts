import chalk from 'chalk';
import inquirer from 'inquirer';
import { readConfig, writeConfig, storeCredential, getAllProfilesWithCredentials, isKeytarAvailable, deleteCredential } from './storage.js';
import { PRESETS } from './types.js';
import type { Profile } from './types.js';

/**
 * Setup command - interactive profile creation wizard
 */
export async function setupCommand(): Promise<void> {
  console.log(chalk.blue.bold('\n🔧 Profile Setup Wizard\n'));

  const presetChoices = [
    ...Object.keys(PRESETS),
    'Custom'
  ];

  const { preset } = await inquirer.prompt<{ preset: string }>([
    {
      type: 'list',
      name: 'preset',
      message: 'Select a preset or create custom:',
      choices: presetChoices
    }
  ]);

  let baseUrl: string;
  let model: string | undefined;

  if (preset === 'Custom') {
    const customAnswers = await inquirer.prompt<{ baseUrl: string; model: string }>([
      {
        type: 'input',
        name: 'baseUrl',
        message: 'Enter API base URL:',
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      },
      {
        type: 'input',
        name: 'model',
        message: 'Enter model name (optional):',
        default: ''
      }
    ]);
    baseUrl = customAnswers.baseUrl;
    model = customAnswers.model || undefined;
  } else {
    const presetConfig = PRESETS[preset];
    baseUrl = presetConfig.baseUrl;
    model = presetConfig.model;
  }

  const config = readConfig();
  
  const { name } = await inquirer.prompt<{ name: string }>([
    {
      type: 'input',
      name: 'name',
      message: 'Enter profile name:',
      validate: (input) => input.trim().length > 0 || 'Profile name cannot be empty'
    }
  ]);

  // Check if profile already exists
  const existingProfile = config.profiles.find(p => p.name === name);
  if (existingProfile) {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Profile "${name}" already exists. Overwrite?`,
        default: false
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Setup cancelled.'));
      return;
    }
  }

  const { apiKey } = await inquirer.prompt<{ apiKey: string }>([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter API key:',
      mask: '*',
      validate: (input) => input.trim().length > 0 || 'API key cannot be empty'
    }
  ]);

  // Save profile
  const profile: Profile = {
    name,
    baseUrl,
    model
  };

  if (existingProfile) {
    // Update existing profile
    const index = config.profiles.findIndex(p => p.name === name);
    config.profiles[index] = profile;
  } else {
    // Add new profile
    config.profiles.push(profile);
  }

  writeConfig(config);
  await storeCredential(name, apiKey);

  console.log(chalk.green(`\n✓ Profile "${name}" saved successfully!`));
  
  if (!isKeytarAvailable()) {
    console.log(chalk.yellow('⚠️  Credentials stored in plaintext (keytar unavailable)'));
  }
}

/**
 * List command - display all profiles
 */
export async function listCommand(): Promise<void> {
  const config = readConfig();
  const profiles = await getAllProfilesWithCredentials();

  if (profiles.length === 0) {
    console.log(chalk.yellow('\nNo profiles configured.'));
    console.log(chalk.blue('Run "ai-codex-starter setup" to create a profile.\n'));
    return;
  }

  console.log(chalk.blue.bold('\n📋 Configured Profiles:\n'));

  for (const profile of profiles) {
    const isDefault = profile.name === config.defaultProfile;
    const defaultMarker = isDefault ? chalk.green(' (default)') : '';
    const credentialStatus = profile.credential ? chalk.green('✓') : chalk.red('✗');

    console.log(chalk.bold(`${profile.name}${defaultMarker}`));
    console.log(`  Base URL: ${profile.baseUrl}`);
    if (profile.model) {
      console.log(`  Model: ${profile.model}`);
    }
    console.log(`  Credential: ${credentialStatus} ${profile.credential ? 'Stored' : 'Missing'}`);
    console.log('');
  }
}

/**
 * Default command - set default profile
 */
export async function setDefaultCommand(profileName: string): Promise<void> {
  const config = readConfig();

  const profile = config.profiles.find(p => p.name === profileName);
  if (!profile) {
    console.error(chalk.red(`\nProfile "${profileName}" not found.`));
    console.log(chalk.yellow('Run "ai-codex-starter list" to see available profiles.\n'));
    process.exit(1);
  }

  config.defaultProfile = profileName;
  writeConfig(config);

  console.log(chalk.green(`\n✓ Default profile set to "${profileName}"\n`));
}

/**
 * Delete command - remove profile
 */
export async function deleteCommand(profileName: string): Promise<void> {
  const config = readConfig();

  const profile = config.profiles.find(p => p.name === profileName);
  if (!profile) {
    console.error(chalk.red(`\nProfile "${profileName}" not found.`));
    console.log(chalk.yellow('Run "ai-codex-starter list" to see available profiles.\n'));
    process.exit(1);
  }

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to delete profile "${profileName}"?`,
      default: false
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('\nDeletion cancelled.\n'));
    return;
  }

  // Remove profile from config
  config.profiles = config.profiles.filter(p => p.name !== profileName);

  // Clear default if this was the default profile
  if (config.defaultProfile === profileName) {
    config.defaultProfile = undefined;
  }

  writeConfig(config);
  await deleteCredential(profileName);

  console.log(chalk.green(`\n✓ Profile "${profileName}" deleted successfully!\n`));
}

/**
 * Doctor command - system health check
 */
export async function doctorCommand(): Promise<void> {
  console.log(chalk.blue.bold('\n🏥 System Health Check\n'));

  // Check keytar availability
  const keytarStatus = isKeytarAvailable();
  console.log(`Keytar (Secure Storage): ${keytarStatus ? chalk.green('✓ Available') : chalk.yellow('✗ Unavailable')}`);
  if (!keytarStatus) {
    console.log(chalk.yellow('  → Credentials stored in plaintext'));
    console.log(chalk.yellow('  → Install system dependencies for secure storage'));
  }

  // Check for Codex CLI
  const { execSync } = await import('child_process');
  let codexAvailable = false;
  try {
    execSync('codex --version', { stdio: 'ignore' });
    codexAvailable = true;
  } catch {
    codexAvailable = false;
  }
  console.log(`Codex CLI: ${codexAvailable ? chalk.green('✓ Found') : chalk.yellow('✗ Not found')}`);
  if (!codexAvailable) {
    console.log(chalk.yellow('  → Install Codex CLI or use --cmd flag for testing'));
  }

  // Check profiles
  const config = readConfig();
  const profiles = await getAllProfilesWithCredentials();
  
  console.log(`\nProfiles: ${profiles.length} configured`);
  
  if (profiles.length === 0) {
    console.log(chalk.yellow('  → No profiles configured'));
    console.log(chalk.yellow('  → Run "ai-codex-starter setup" to create a profile'));
  } else {
    for (const profile of profiles) {
      const credStatus = profile.credential ? chalk.green('✓') : chalk.red('✗');
      const defaultMarker = profile.name === config.defaultProfile ? chalk.green(' (default)') : '';
      console.log(`  ${credStatus} ${profile.name}${defaultMarker}`);
    }
  }

  // Check config file
  console.log(`\nConfiguration File:`);
  const configPath = process.env.AI_CODEX_CONFIG_PATH || '~/.ai-codex-profiles.json';
  console.log(`  Location: ${configPath}`);
  
  try {
    readConfig();
    console.log(`  Status: ${chalk.green('✓ Valid')}`);
  } catch {
    console.log(`  Status: ${chalk.red('✗ Invalid or corrupted')}`);
  }

  console.log('');
}
