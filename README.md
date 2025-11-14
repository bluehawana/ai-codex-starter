# ai-codex-starter

Multi-profile OpenAI-compatible CLI launcher with secure credential management.

**Inspired by [ai-claude-start](https://github.com/op7418/ai-claude-start)** - we loved the concept and built our own tool for OpenAI-compatible APIs!

## Features

- **Multi-Profile Support**: Manage multiple API configurations (OpenAI, Azure, Kimi, Minimax, or custom)
- **Secure Credential Storage**: Uses OS-level keychain (macOS Keychain, Windows Credential Vault, Linux Secret Service)
- **Simplified Configuration**: Only 3-4 fields needed - name, base URL, optional model, and API key
- **Environment Sanitization**: Cleans all `OPENAI_*` variables before injection to prevent conflicts
- **Interactive Setup**: Guided wizard with built-in presets
- **Interactive Selection**: Shows selection menu when multiple profiles configured
- **Testing Support**: Built-in `--cmd` flag and `CODEX_CMD` environment variable for testing

## Installation

```bash
npm install -g ai-codex-starter
```

Or use directly with `npx`:

```bash
npx ai-codex-starter setup
```

## Quick Start

### 1. First-time Setup

Run the setup wizard to create your first profile:

```bash
ai-codex-starter setup
```

You'll be guided through selecting a preset (OpenAI ChatGPT, Azure, Kimi, Minimax) or creating a custom profile.

### 2. Launch Codex

**With interactive selection** (multiple profiles):

```bash
codex-start
# Shows selection menu
```

**Auto-select** (single profile):

```bash
codex-start
# Automatically uses the only profile
```

**Specify profile directly**:

```bash
codex-start my-profile
```

**Pass arguments**:

```bash
codex-start my-profile --version
codex-start --help
```

## Commands

### `setup`

Interactive wizard to create or update a profile.

```bash
ai-codex-starter setup
```

### `list`

Display all configured profiles with their settings and credential status.

```bash
ai-codex-starter list
```

### `default <name>`

Set the default profile to use when no profile is specified.

```bash
ai-codex-starter default my-profile
```

### `delete <name>`

Delete a profile and its stored credentials.

```bash
ai-codex-starter delete my-profile
```

### `doctor`

Check system health: keytar availability, profiles, credentials, and Codex CLI presence.

```bash
ai-codex-starter doctor
```

## Profile Configuration

A profile consists of 3-5 fields:

```typescript
{
  name: string;           // Unique identifier
  baseUrl: string;        // API base URL
  model?: string;         // Optional model name
  envKeyName?: string;    // Optional custom env variable (e.g., 'MINIMAX_API_KEY')
  apiKey: string;         // API key (stored securely)
}
```

### Built-in Presets

1. **OpenAI ChatGPT** (Official)

   - Base URL: `https://api.openai.com/v1`
   - Model: `gpt-4`
   - Use: Official OpenAI API

2. **Azure OpenAI**

   - Base URL: `https://YOUR_RESOURCE.openai.azure.com`
   - Model: `gpt-4-32k`
   - Use: Azure OpenAI Service

3. **Kimi (Moonshot)**

   - Base URL: `https://api.moonshot.cn/v1`
   - Model: `moonshot-v1-8k`
   - Use: Moonshot AI (China)

4. **Minimax**

   - Base URL: `https://api.minimax.chat/v1`
   - Model: `abab6.5-chat`
   - Use: Minimax AI (China)

5. **Custom**
   - Define your own base URL and model
   - Any OpenAI-compatible API

## Environment Handling

### Sanitization

When launching, all existing `OPENAI_*` environment variables are removed to prevent conflicts.

### Injection

Two environment variables are set:

- `OPENAI_API_KEY`: Your credential (always)
- `OPENAI_BASE_URL`: The base URL (only if not the default OpenAI URL)

Example for Kimi:

```bash
OPENAI_API_KEY=your-kimi-key
OPENAI_BASE_URL=https://api.moonshot.cn/v1
```

### Model Configuration

If a model is configured in the profile, the `--model` parameter is automatically added:

```bash
codex --model moonshot-v1-8k [other arguments...]
```

## Testing Without Codex CLI

For testing or development without the actual Codex CLI installed:

### Using `--cmd` Flag

```bash
ai-codex-starter --cmd "node -e 'console.log(process.env.OPENAI_API_KEY)'"
```

### Using `CODEX_CMD` Environment Variable

```bash
export CODEX_CMD="node -e 'console.log(process.env.OPENAI_API_KEY)'"
ai-codex-starter
```

This is useful for:

- Testing credential injection
- Debugging environment setup
- CI/CD pipelines
- Development without Codex CLI

## Security

### Keytar (Preferred)

When available, credentials are stored in your operating system's secure keychain:

- **macOS**: Keychain
- **Windows**: Credential Vault
- **Linux**: Secret Service API (libsecret)

### File Fallback

If `keytar` is unavailable (e.g., missing system dependencies), credentials are stored in:

```
~/.ai-codex-profiles.json
```

**⚠️ Warning**: Fallback mode stores credentials in **plaintext**. The tool will display a warning when using this mode.

To enable secure storage, ensure your system has the required dependencies for `keytar`.

## Environment Variables

- `AI_CODEX_CONFIG_PATH`: Override config file location (default: `~/.ai-codex-profiles.json`)
- `CODEX_CMD`: Override codex binary for testing

## Usage Examples

### Configure Multiple APIs

```bash
# Configure OpenAI official
ai-codex-starter setup
# Choose: OpenAI ChatGPT
# Name: openai
# API Key: [your OpenAI API key]

# Configure Kimi
ai-codex-starter setup
# Choose: Kimi (Moonshot)
# Name: kimi
# API Key: [your Kimi API key]

# Configure Minimax
ai-codex-starter setup
# Choose: Minimax
# Name: minimax
# API Key: [your Minimax API key]
```

### Switch Between APIs

```bash
# Method 1: Interactive selection
codex-start
? Select a profile to use:
❯ openai (default)
  kimi
  minimax

# Method 2: Direct specification
codex-start kimi        # Use Kimi
codex-start minimax     # Use Minimax
codex-start openai      # Use OpenAI
```

### Set Default Profile

```bash
# Set the most commonly used as default
ai-codex-starter default kimi

# Now direct run will use kimi by default
codex-start
```

### Create Aliases for Quick Switching

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Quick launch specific profiles
alias codex-cn="codex-start kimi"
alias codex-mm="codex-start minimax"
alias codex-official="codex-start openai"

# Usage
codex-cn        # Use Kimi (China)
codex-mm        # Use Minimax
codex-official  # Use OpenAI official
```

## Troubleshooting

### "keytar not available" Warning

If you see this warning, `keytar` couldn't be loaded. Credentials will be stored in plaintext. To fix:

**macOS**: Usually works out of the box

**Linux**: Install `libsecret-1-dev`:

```bash
sudo apt-get install libsecret-1-dev  # Debian/Ubuntu
sudo yum install libsecret-devel      # Fedora/RHEL
```

**Windows**: Usually works out of the box

Then reinstall:

```bash
npm install -g ai-codex-starter --force
```

### "Codex CLI not found"

The tool requires a Codex CLI to be installed and in your PATH, or use the `--cmd` flag for testing.

### Profile Not Found

Run `ai-codex-starter list` to see available profiles, or `ai-codex-starter setup` to create a new one.

## Attribution

This project was inspired by [ai-claude-start](https://github.com/op7418/ai-claude-start) by op7418. We loved the architecture and concept, so we built our own version for OpenAI-compatible APIs. All code is independently written.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

https://github.com/bluehawana/ai-codex-starter
