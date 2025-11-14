# Testing ai-codex-starter with Multiple Profiles

## Available Profiles

Run `node dist/cli.js list` to see all configured profiles:

```
anyrouter
  Base URL: https://anyrouter.top/v1
  Model: gpt-5-codex
  Credential: ✓ Stored

minimax
  Base URL: https://api.minimax.io/v1
  Model: MiniMax-M2
  Credential: ✓ Stored
```

## Usage Options

### 1. Direct Profile Selection

Specify the profile name directly:

```bash
# Use MiniMax
node dist/cli.js minimax exec "what is 2+2"

# Use AnyRouter
node dist/cli.js anyrouter exec "what is 3+3"
```

### 2. Interactive Selection

Run without specifying a profile to get an interactive menu:

```bash
node dist/cli.js exec "your question"
```

This will show:

```
? Select a profile to use:
❯ anyrouter
  minimax
```

### 3. Set Default Profile

Set a default profile so you don't need to select every time:

```bash
node dist/cli.js default minimax
```

Then you can just run:

```bash
node dist/cli.js exec "your question"
```

## Test Results

### ✅ MiniMax - Working

```bash
node dist/cli.js minimax exec "what is 2+2"
```

Output: `2+2 = 4` ✓

### ⚠️ AnyRouter - Connection Issue

```bash
node dist/cli.js anyrouter exec "what is 3+3"
```

Error: `stream disconnected before completion: UTF8 error`

**Note**: The anyrouter API might have connectivity issues or require a valid API key with sufficient balance. Please verify your anyrouter API key and account status.

## Adding More Profiles

You can add more profiles like ChatGPT:

```bash
node dist/cli.js setup
```

Select "OpenAI ChatGPT" and enter your OpenAI API key.
