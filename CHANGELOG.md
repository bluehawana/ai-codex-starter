# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-01-XX

### Added

- Initial release of ai-codex-starter
- Multi-profile management for OpenAI-compatible APIs
- Secure credential storage using OS keychain (keytar)
- Graceful fallback to file storage when keytar unavailable
- Interactive setup wizard with presets for:
  - OpenAI ChatGPT
  - Azure OpenAI
  - Kimi (Moonshot)
  - Minimax
  - Custom endpoints
- Profile management commands:
  - `setup`: Create or update profiles
  - `list`: Display all configured profiles
  - `default`: Set default profile
  - `delete`: Remove profiles
  - `doctor`: System health check
- Environment variable sanitization (removes all OPENAI\_\* vars)
- Environment variable injection (OPENAI_API_KEY, OPENAI_BASE_URL)
- Automatic model parameter injection
- Interactive profile selection for multiple profiles
- Auto-selection for single profile
- Testing support with `--cmd` flag and `CODEX_CMD` environment variable
- Comprehensive documentation and examples
- MIT License

### Features

- Support for 10+ concurrent profiles
- Profile validation and confirmation for overwrites
- Credential status display without revealing keys
- Visual formatting with chalk
- TypeScript implementation with full type safety
- Vitest test suite for storage and executor layers
- Global NPM installation support

### Security

- OS-level secure credential storage (primary mode)
- Plaintext file storage with warnings (fallback mode)
- Never stores credentials in config files (primary mode)
- Complete environment isolation
- No credentials in logs or error messages
