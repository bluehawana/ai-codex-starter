# Moonshot (Kimi) 配置指南

## Moonshot API 信息

根据 README 中的预设配置：
- **Provider**: Kimi (Moonshot)
- **Base URL**: `https://api.moonshot.cn/v1`
- **Model**: `moonshot-v1-8k`
- **API Type**: OpenAI-compatible

## 获取 API Key

1. 访问 Moonshot 官网: https://platform.moonshot.cn/
2. 注册/登录账户
3. 在控制台获取 API Key（格式通常是 `sk-` 开头）

## 配置步骤

### 方法 1: 使用 ai-codex-starter setup 命令

```bash
node dist/cli.js setup
```

选择：
- Preset: **Kimi (Moonshot)**
- Name: `moonshot` 或 `kimi`
- API Key: [输入您的 Moonshot API Key]

### 方法 2: 手动配置

#### 1. 更新 Codex 配置

编辑 `~/.codex/config.toml`，添加：

```toml
[model_providers.moonshot]
name = "Moonshot AI"
base_url = "https://api.moonshot.cn/v1"
wire_api = "chat"

[profiles.moonshot]
model = "moonshot-v1-8k"
model_provider = "moonshot"
```

也可以设置为默认：
```toml
model = "moonshot-v1-8k"
model_provider = "moonshot"
```

#### 2. 更新 Codex 认证

如果使用 Moonshot 作为主要 provider，编辑 `~/.codex/auth.json`:

```json
{
  "OPENAI_API_KEY": "your-moonshot-api-key-here"
}
```

#### 3. 更新 ai-codex-starter 配置

编辑 `~/.ai-codex-profiles.json`，添加 profile：

```json
{
  "config": {
    "profiles": [
      {
        "name": "moonshot",
        "baseUrl": "https://api.moonshot.cn/v1",
        "model": "moonshot-v1-8k",
        "modelProvider": "moonshot"
      }
    ]
  },
  "credentials": {
    "moonshot": "your-moonshot-api-key-here"
  }
}
```

## 可用模型

Moonshot 提供多个模型选择：
- `moonshot-v1-8k` - 8K 上下文窗口
- `moonshot-v1-32k` - 32K 上下文窗口
- `moonshot-v1-128k` - 128K 上下文窗口

## 测试配置

### 测试 API 直接访问

```javascript
// test-moonshot.js
const apiKey = "your-moonshot-api-key";

const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "moonshot-v1-8k",
    messages: [
      {
        role: "user",
        content: "你好，请用中文回答：1+1等于几？",
      },
    ],
    max_tokens: 100,
  }),
});

const data = await response.json();
console.log(data);
```

### 测试 Codex CLI

```bash
codex exec "你好，请介绍一下你自己"
```

### 测试 ai-codex-starter

```bash
codex-start moonshot exec "写一个 hello world 程序"
```

## 与其他服务对比

| Provider | Base URL | Model Example | 状态 |
|----------|----------|---------------|------|
| **Moonshot** | https://api.moonshot.cn/v1 | moonshot-v1-8k | 待测试 |
| AnyRouter | https://anyrouter.top/v1 | gpt-5-codex | ❌ 账户无权限 |
| MiniMax | https://api.minimax.io/v1 | MiniMax-M2 | ✅ 工作正常 |

## 注意事项

1. **API Key 格式**: Moonshot API Key 通常以 `sk-` 开头
2. **请求限制**: 注意 API 的速率限制和配额
3. **模型选择**: 根据需要的上下文长度选择合适的模型
4. **中文支持**: Moonshot 对中文支持很好，适合中文任务

## 准备好测试了吗？

请提供您的 Moonshot API Key，我会帮您：
1. ✅ 配置 Codex CLI
2. ✅ 配置 ai-codex-starter
3. ✅ 测试 API 连接
4. ✅ 验证聊天功能
5. ✅ 确认完全工作
