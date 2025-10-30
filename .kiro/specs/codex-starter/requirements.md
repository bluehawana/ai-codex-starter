# Requirements Document

## Introduction

The Codex Starter is a multi-profile CLI launcher for OpenAI Codex and compatible APIs, enabling developers to manage multiple API configurations with secure credential storage. The system allows users to switch between different API providers (OpenAI, Azure OpenAI, or custom endpoints) seamlessly while maintaining secure credential management and environment isolation.

## Glossary

- **Codex_Launcher**: The CLI application that manages profiles and launches Codex sessions
- **Profile**: A named configuration containing API endpoint, model, and authentication credentials
- **Credential_Store**: The secure storage mechanism for API keys (OS keychain or encrypted file)
- **Environment_Sanitizer**: The component that cleans conflicting environment variables before injection
- **API_Provider**: A service offering OpenAI-compatible API endpoints (OpenAI, Azure, custom)
- **Default_Profile**: The profile automatically selected when no profile is explicitly specified

## Requirements

### Requirement 1

**User Story:** As a developer, I want to configure multiple API profiles, so that I can switch between different Codex providers without manual environment variable management

#### Acceptance Criteria

1. WHEN the user executes the setup command, THE Codex_Launcher SHALL present an interactive wizard with preset options for OpenAI, Azure OpenAI, and custom endpoints
2. WHEN the user completes the setup wizard, THE Codex_Launcher SHALL store the profile configuration with name, base URL, model, and API key
3. THE Codex_Launcher SHALL support a minimum of 10 concurrent profiles
4. WHEN the user provides a profile name that already exists, THE Codex_Launcher SHALL prompt for confirmation before overwriting
5. THE Codex_Launcher SHALL validate that the base URL follows valid URL format before saving

### Requirement 2

**User Story:** As a security-conscious developer, I want my API keys stored securely, so that my credentials are protected from unauthorized access

#### Acceptance Criteria

1. WHEN the operating system keychain is available, THE Credential_Store SHALL store API keys using the OS-level secure storage mechanism
2. IF the OS keychain is unavailable, THEN THE Credential_Store SHALL store credentials in an encrypted local file and display a security warning
3. THE Codex_Launcher SHALL never store credentials in plaintext configuration files
4. WHEN a profile is deleted, THE Credential_Store SHALL remove the associated credentials from secure storage
5. THE Codex_Launcher SHALL verify credential availability before launching a Codex session

### Requirement 3

**User Story:** As a developer, I want to list all my configured profiles, so that I can see what API configurations are available

#### Acceptance Criteria

1. WHEN the user executes the list command, THE Codex_Launcher SHALL display all configured profiles with their names, base URLs, and models
2. THE Codex_Launcher SHALL indicate which profile is set as the default
3. THE Codex_Launcher SHALL show credential status (stored/missing) for each profile without revealing the actual key
4. WHEN no profiles exist, THE Codex_Launcher SHALL display a helpful message directing users to the setup command
5. THE Codex_Launcher SHALL format the output with clear visual separation between profiles

### Requirement 4

**User Story:** As a developer, I want to set a default profile, so that I can launch Codex quickly without specifying a profile each time

#### Acceptance Criteria

1. WHEN the user executes the default command with a profile name, THE Codex_Launcher SHALL set that profile as the default
2. THE Codex_Launcher SHALL validate that the specified profile exists before setting it as default
3. WHEN launching without a profile argument, THE Codex_Launcher SHALL use the default profile
4. IF no default profile is set and multiple profiles exist, THEN THE Codex_Launcher SHALL present an interactive selection menu
5. WHEN only one profile exists, THE Codex_Launcher SHALL automatically use it as the default

### Requirement 5

**User Story:** As a developer, I want to delete profiles I no longer use, so that I can keep my configuration clean and remove outdated credentials

#### Acceptance Criteria

1. WHEN the user executes the delete command with a profile name, THE Codex_Launcher SHALL remove the profile configuration
2. THE Codex_Launcher SHALL remove the associated credentials from the Credential_Store
3. THE Codex_Launcher SHALL prompt for confirmation before deleting a profile
4. IF the deleted profile was the default, THEN THE Codex_Launcher SHALL clear the default profile setting
5. THE Codex_Launcher SHALL display a success message after deletion

### Requirement 6

**User Story:** As a developer, I want clean environment variable injection, so that different API configurations don't conflict with each other

#### Acceptance Criteria

1. WHEN launching a Codex session, THE Environment*Sanitizer SHALL remove all existing OPENAI*\* environment variables
2. THE Codex_Launcher SHALL inject OPENAI_API_KEY with the profile's credential
3. WHEN the base URL is not the default OpenAI endpoint, THE Codex_Launcher SHALL inject OPENAI_BASE_URL
4. WHEN a model is specified in the profile, THE Codex_Launcher SHALL pass the model parameter to the Codex command
5. THE Codex_Launcher SHALL preserve all non-OPENAI environment variables

### Requirement 7

**User Story:** As a developer, I want to launch Codex with a specific profile, so that I can use different API providers for different tasks

#### Acceptance Criteria

1. WHEN the user executes the launcher with a profile name, THE Codex_Launcher SHALL use that profile's configuration
2. THE Codex_Launcher SHALL pass additional command-line arguments to the Codex CLI
3. WHEN the specified profile does not exist, THE Codex_Launcher SHALL display an error message and list available profiles
4. THE Codex_Launcher SHALL verify that credentials exist for the profile before launching
5. THE Codex_Launcher SHALL execute the Codex CLI with the sanitized and injected environment

### Requirement 8

**User Story:** As a developer, I want a health check command, so that I can diagnose configuration and system issues

#### Acceptance Criteria

1. WHEN the user executes the doctor command, THE Codex_Launcher SHALL check for Codex CLI availability in the system PATH
2. THE Codex_Launcher SHALL report the status of the secure credential storage mechanism
3. THE Codex_Launcher SHALL list all profiles and their credential status
4. THE Codex_Launcher SHALL verify that the configuration file is readable and valid
5. THE Codex_Launcher SHALL provide actionable recommendations for any detected issues

### Requirement 9

**User Story:** As a developer testing the launcher, I want to run it without the actual Codex CLI, so that I can verify environment injection and configuration

#### Acceptance Criteria

1. WHEN the user provides the --cmd flag with a custom command, THE Codex_Launcher SHALL execute that command instead of the Codex CLI
2. THE Codex_Launcher SHALL support the CODEX_CMD environment variable as an alternative to the --cmd flag
3. THE Codex_Launcher SHALL inject environment variables when using custom commands
4. THE Codex_Launcher SHALL pass all additional arguments to the custom command
5. WHEN both --cmd flag and CODEX_CMD variable are set, THE Codex_Launcher SHALL prioritize the --cmd flag

### Requirement 10

**User Story:** As a developer, I want to push this project to my GitHub repository, so that I can version control and share the code

#### Acceptance Criteria

1. THE Codex_Launcher SHALL include a .gitignore file that excludes node_modules, dist, and credential files
2. THE Codex_Launcher SHALL include a README.md with installation and usage instructions
3. THE Codex_Launcher SHALL include a package.json configured for the repository https://github.com/bluehawana/ai-codex-starter.git
4. THE Codex_Launcher SHALL include an MIT license file
5. THE Codex_Launcher SHALL be ready for npm publish after initial git push
