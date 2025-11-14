# Troubleshooting Guide

## AnyRouter API Issues

### Problem: "当前 API 不支持所选模型" (Model Not Supported)

**Symptoms:**

- AnyRouter API returns 404 errors
- Error message: "当前 API 不支持所选模型 [model-name]"
- Models are listed in `/v1/models` endpoint but not accessible

**Possible Causes:**

1. API key doesn't have access to the requested models
2. Account needs additional configuration
3. Model names in the list don't match the actual accessible models

**Solutions:**

1. Contact AnyRouter support to verify which models your API key can access
2. Check your AnyRouter account dashboard for model permissions
3. Try different model names from the available list

### Problem: UTF8 Error with Codex CLI

**Symptoms:**

```
ERROR: stream disconnected before completion: UTF8 error: invalid utf-8 sequence of 1 bytes from index 0
```

**Possible Causes:**

1. API response format incompatibility with codex CLI
2. Network/proxy issues corrupting the response
3. AnyRouter API returning non-UTF8 encoded data

**Solutions:**

1. Verify the API works with direct curl/fetch requests
2. Check if a VPN or proxy is interfering
3. Contact AnyRouter support about codex CLI compatibility
4. Try using a different `wire_api` setting in codex config

### Working Configuration Example

For reference, here's a working MiniMax configuration:

```toml
[model_providers.minimax]
name = "MiniMax Chat Completions API"
base_url = "https://api.minimax.io/v1"
env_key = "MINIMAX_API_KEY"
wire_api = "chat"
requires_openai_auth = false
request_max_retries = 4
stream_max_retries = 10
stream_idle_timeout_ms = 300000

[profiles.m2]
model = "MiniMax-M2"
model_provider = "minimax"
```

## MiniMax API Issues

### Problem: "insufficient balance"

**Symptoms:**

```json
{ "status_code": 1008, "status_msg": "insufficient balance" }
```

**Solution:**
Add credits to your MiniMax account at https://api.minimax.io

### Problem: Invalid Model Name

**Symptoms:**

```json
{ "status_code": 2013, "status_msg": "invalid params, fail to get model info" }
```

**Solution:**
Use the correct model name: `MiniMax-M2` (not `codex-MiniMax-M2` or `abab6.5s-chat`)

## General Issues

### Problem: Profile Not Found

**Symptoms:**

```
Profile "profile-name" not found.
```

**Solution:**

```bash
# List available profiles
node dist/cli.js list

# Create a new profile
node dist/cli.js setup
```

### Problem: No Credential Found

**Symptoms:**

```
No credential found for profile "profile-name".
```

**Solution:**

```bash
# Re-run setup to store the credential
node dist/cli.js setup
```

### Problem: Codex CLI Not Found

**Symptoms:**

```
Failed to execute command: spawn codex ENOENT
```

**Solution:**
Install codex CLI:

```bash
npm i -g @openai/codex
```

## Testing API Connectivity

### Test MiniMax API Directly

```bash
curl -X POST https://api.minimax.io/v1/chat/completions \
  -H "Authorization: Bearer YOUR_MINIMAX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MiniMax-M2",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Test AnyRouter API Directly

```bash
curl -X POST https://anyrouter.top/v1/chat/completions \
  -H "Authorization: Bearer YOUR_ANYROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Getting Help

If you continue to experience issues:

1. Run the doctor command:

   ```bash
   node dist/cli.js doctor
   ```

2. Check the logs in your terminal for detailed error messages

3. For MiniMax issues: Contact api@minimax.io

4. For AnyRouter issues: Contact AnyRouter support

5. For ai-codex-starter issues: Open an issue on GitHub
