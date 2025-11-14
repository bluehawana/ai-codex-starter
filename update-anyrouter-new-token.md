# 更新 AnyRouter Token 配置

## 问题原因
当前 Token 额度为 **-1951**（已超支），无法使用任何模型。

## 获取新 Token 后的更新步骤

### 1. 更新 Codex 配置

编辑 `~/.codex/auth.json`：

```bash
notepad %USERPROFILE%\.codex\auth.json
```

替换为新的 API Key：

```json
{
  "OPENAI_API_KEY": "sk-YOUR_NEW_TOKEN_HERE"
}
```

### 2. 更新 ai-codex-starter 配置（如果使用）

#### 方法 A：使用 setup 命令重新配置

```bash
node dist/cli.js setup
```

选择 "anyrouter" 配置，输入新的 API Key。

#### 方法 B：手动更新配置文件

编辑 `~/.ai-codex-profiles.json`，在 `credentials` 部分添加：

```json
{
  "config": {
    "profiles": [
      {
        "name": "anyrouter",
        "baseUrl": "https://anyrouter.top/v1",
        "model": "gpt-5-codex",
        "modelProvider": "anyrouter"
      }
    ]
  },
  "credentials": {
    "anyrouter": "sk-YOUR_NEW_TOKEN_HERE"
  }
}
```

### 3. 测试新配置

```bash
# 使用 ai-codex-starter
codex-start anyrouter exec "what is 2+2"

# 或直接使用 Codex
codex exec "what is 2+2"
```

## 创建新 Token 的建议设置

在 AnyRouter 控制台创建新 Token 时：

| 设置项 | 推荐值 | 说明 |
|--------|--------|------|
| **名称** | `codex-unlimited` | 便于识别 |
| **过期时间** | 根据需求设置 | 不要设置为 1970 年 |
| **额度** | **无限额度** 或 大正数 | 避免再次超支 |
| **IP 白名单** | 留空 | 除非有安全需求 |
| **模型限制** | 不勾选 | 允许使用所有模型 |
| **分组** | 默认分组 | 保持默认即可 |

## 验证 Token 是否有效

创建脚本测试新 Token：

```javascript
// test-new-token.js
const apiKey = "sk-YOUR_NEW_TOKEN_HERE";

const response = await fetch("https://anyrouter.top/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-5-codex",
    messages: [{ role: "user", content: "Say 'Token works!'" }],
    max_tokens: 50,
  }),
});

const data = await response.json();
console.log(response.status === 200 ? "✅ Token 有效！" : "❌ Token 无效");
console.log(JSON.stringify(data, null, 2));
```

运行测试：
```bash
node test-new-token.js
```

## 总结

**当前问题**：Token 额度为负 (-1951)
**解决方案**：
1. ✅ 充值账户
2. ✅ 或创建新的 Token（额度设为无限）
3. ✅ 更新配置文件
4. ✅ 测试确认

**配置本身**：✅ 已经正确（modelProvider 已添加）
**下一步**：获取有效额度的 API Token
