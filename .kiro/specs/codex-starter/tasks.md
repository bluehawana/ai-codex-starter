# Implementation Plan

- [x] 1. Set up project structure and configuration

  - Create package.json with correct repository URL, bin entries, and dependencies
  - Create tsconfig.json for TypeScript compilation
  - Create vitest.config.ts for testing setup
  - Create .gitignore to exclude node_modules, dist, and credential files
  - Create MIT LICENSE file
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 2. Implement type definitions and presets

  - Create src/types.ts with Profile, ProfileWithCredential, and Config interfaces
  - Define PRESETS constant with OpenAI ChatGPT, Azure OpenAI, Kimi, and Minimax configurations
  - Define SERVICE_NAME constant for keychain identification
  - _Requirements: 1.1, 1.2_

- [ ] 3. Implement storage layer
- [x] 3.1 Create configuration management functions

  - Write readConfig() function to read from ~/.ai-codex-profiles.json
  - Write writeConfig() function to save configuration
  - Support AI_CODEX_CONFIG_PATH environment variable for custom config location
  - _Requirements: 1.2, 1.3_

- [x] 3.2 Implement credential storage with keytar

  - Implement storeCredential() function using keytar for OS keychain
  - Implement getCredential() function to retrieve from keychain
  - Implement deleteCredential() function to remove from keychain
  - Add graceful fallback to file storage when keytar unavailable
  - Display warning when using file storage fallback
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3.3 Create utility functions

  - Implement getAllProfilesWithCredentials() to fetch all profiles with credential status
  - Implement isKeytarAvailable() to check keytar availability
  - _Requirements: 2.5, 3.3_

- [x] 3.4 Write storage layer tests

  - Create src/storage.test.ts with tests for config read/write
  - Test credential storage and retrieval with mocked keytar
  - Test fallback mode behavior
  - Test profile CRUD operations
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 4. Implement environment sanitization and execution
- [x] 4.1 Create environment sanitizer

  - Write sanitizeEnvironment() function to remove all OPENAI\_\* environment variables
  - Preserve all non-OPENAI environment variables
  - _Requirements: 6.1, 6.5_

- [x] 4.2 Implement environment preparation

  - Write prepareEnvironment() function to inject OPENAI_API_KEY
  - Inject OPENAI_BASE_URL when base URL is not default OpenAI endpoint
  - _Requirements: 6.2, 6.3_

- [x] 4.3 Create profile execution logic

  - Write executeWithProfile() function with profile selection logic
  - Implement auto-selection for single profile
  - Implement interactive menu for multiple profiles using inquirer
  - Add credential validation before execution
  - Support --cmd flag and CODEX_CMD environment variable for testing
  - Add --model flag injection when profile has model configured
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 6.4, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 4.4 Write executor tests

  - Create src/executor.test.ts with tests for environment sanitization
  - Test environment preparation logic
  - Test profile selection scenarios
  - Test model injection
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 5. Implement CLI commands
- [x] 5.1 Create setup command

  - Write setupCommand() with interactive wizard using inquirer
  - Present preset options (OpenAI ChatGPT, Azure, Kimi, Minimax, Custom)
  - Prompt for profile name, base URL, model, and API key
  - Validate URL format before saving
  - Support updating existing profiles with confirmation
  - Store profile configuration and credentials
  - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [x] 5.2 Create list command

  - Write listCommand() to display all profiles with chalk formatting
  - Show profile name, base URL, and model
  - Indicate default profile with visual marker
  - Show credential status without revealing actual keys
  - Display helpful message when no profiles exist
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5.3 Create default command

  - Write setDefaultCommand() to set default profile
  - Validate that profile exists before setting
  - Update config with default profile name
  - Display confirmation message
  - _Requirements: 4.1, 4.2_

- [x] 5.4 Create delete command

  - Write deleteCommand() with confirmation prompt
  - Remove profile from configuration
  - Delete credentials from secure storage
  - Clear default profile if deleted profile was default
  - Display success message
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5.5 Create doctor command

  - Write doctorCommand() to check system health
  - Check for Codex CLI in system PATH
  - Report keytar availability status
  - List all profiles with credential status
  - Validate config file integrity
  - Provide actionable recommendations for issues
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 6. Create CLI entry point

  - Create src/cli.ts with commander.js setup
  - Define two bin commands: ai-codex-starter and codex-start
  - Route subcommands (setup, list, default, delete, doctor) to command handlers
  - Route direct execution to executeWithProfile
  - Add --help and --version flags
  - Handle --cmd flag for custom command execution
  - _Requirements: 7.1, 7.2, 9.1_

- [ ] 7. Create comprehensive documentation
- [x] 7.1 Write README.md

  - Add project description and features
  - Include installation instructions (npm install -g ai-codex-starter)
  - Document all commands with examples
  - Add quick start guide
  - Include preset configurations (OpenAI, Azure, Kimi, Minimax)
  - Document environment variables (AI_CODEX_CONFIG_PATH, CODEX_CMD)
  - Add troubleshooting section
  - Include attribution to ai-claude-start for inspiration
  - Add security considerations
  - _Requirements: 10.2, 1.1, 3.1, 4.1, 5.1, 8.1, 9.1_

- [x] 7.2 Create CHANGELOG.md

  - Document version 1.0.0 initial release
  - List all features implemented
  - _Requirements: 10.2_

- [-] 8. Initialize Git repository and push to GitHub

  - Run git init in project root
  - Add all files to git
  - Create initial commit
  - Add remote origin https://github.com/bluehawana/ai-codex-starter.git
  - Push to main branch
  - _Requirements: 10.1, 10.3, 10.5_

- [-] 9. Build and test the package

  - Run npm install to install dependencies
  - Run npm run build to compile TypeScript
  - Run npm test:run to execute tests
  - Test npm link for local installation
  - Verify all commands work correctly
  - Test with different API providers
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1_
