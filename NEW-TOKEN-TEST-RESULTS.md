# 新 Token 测试结果

## Token 信息
- **Token**: `sk-UgahSezkEXcUeYJ7DzqsaJ9gL7P14UrsI1sew6GLgBHoD5E2`
- **测试时间**: 2025-11-14

## 配置更新 ✅

### 已更新文件
1. ✅ `~/.codex/auth.json` - Codex CLI 配置
2. ✅ `~/.ai-codex-profiles.json` - ai-codex-starter 配置

## 测试结果

### ✅ Token 验证通过
- Token 格式正确
- API 认证成功（200 OK）
- 可以访问 `/v1/models` 端点
- 可以访问 `/v1/dashboard/billing/subscription` 端点

### ✅ 账户状态良好
```json
{
  "object": "billing_subscription",
  "has_payment_method": true,
  "soft_limit_usd": 100000000,
  "hard_limit_usd": 100000000,
  "system_hard_limit_usd": 100000000,
  "access_until": 3251145599
}
```

- ✅ 已绑定支付方式
- ✅ 软限制: $100,000,000 USD
- ✅ 硬限制: $100,000,000 USD
- ✅ 访问有效期: 3251145599 (2072-12-31)

### ❌ 模型访问失败

**问题**：与旧 Token 完全相同的错误！

#### API 直接测试
```bash
POST https://anyrouter.top/v1/chat/completions
{
  "model": "gpt-5-codex",
  "messages": [{"role": "user", "content": "What is 2+2?"}]
}
```

**结果**: 404 Not Found
```json
{
  "error": "当前 API 不支持所选模型 gpt-5-codex",
  "type": "error"
}
```

#### Codex CLI 测试
```bash
$ codex exec "what is 3+3"

ERROR: To use Codex with your ChatGPT plan, upgrade to Plus
```

显示使用的配置：
- model: gpt-5-codex
- provider: anyrouter

但返回 OpenAI 的错误信息！

## 关键发现

### 🔴 两个 Token 对比

| 项目 | 旧 Token | 新 Token | 结果 |
|------|----------|----------|------|
| **Token** | sk-tvNH...N0Dw | sk-Ugah...D5E2 | 不同 ✅ |
| **认证** | 成功 ✅ | 成功 ✅ | 相同 |
| **账户额度** | $2,000,000,000 | $100,000,000 | 不同但都很大 |
| **模型列表** | 11 个模型 | 11 个模型 | 相同 |
| **聊天完成** | ❌ 全部失败 | ❌ 全部失败 | **完全相同的错误** |
| **错误信息** | "当前 API 不支持所选模型" | "当前 API 不支持所选模型" | **完全相同** |

### 🎯 根本问题

**不是 Token 额度的问题！**

两个不同的 Token：
- ✅ 都能认证
- ✅ 都有巨额限制
- ✅ 都能列出模型
- ❌ **但都无法使用任何模型**

这表明问题在于：

1. **AnyRouter 账户层面的限制**
   - 可能账户本身没有激活模型访问权限
   - 可能需要特殊的订阅或授权

2. **API 端点问题**
   - `/v1/models` 端点可以访问（列出模型）
   - `/v1/chat/completions` 端点返回 404（模型不支持）
   - 可能需要使用不同的 API 端点或参数

3. **账户配置问题**
   - 可能需要在 AnyRouter 控制台中启用特定设置
   - 可能需要申请或激活模型访问权限
   - 可能是新注册账户的限制期

## 建议的后续行动

### 🔍 方案 1: 检查 AnyRouter 控制台

登录 https://anyrouter.top 并检查：

1. **账户状态页面**
   - 是否有"待激活"或"待审核"状态
   - 是否需要完成额外的验证步骤

2. **API 令牌设置**
   - 检查 Token 的详细权限设置
   - 确认是否有"模型访问"开关或选项
   - 查看是否有"启用模型"的按钮

3. **订阅/套餐页面**
   - 是否需要购买特定套餐才能使用模型
   - 免费账户是否有使用限制

4. **使用统计/日志**
   - 查看是否有API调用记录
   - 查看是否有错误日志

### 📞 方案 2: 联系 AnyRouter 客服

提供以下信息：

```
问题描述：
- 创建了两个不同的 API Token
- Token 可以通过认证，可以访问 /v1/models 端点
- 但任何 /v1/chat/completions 请求都返回 "当前 API 不支持所选模型"
- 测试了所有 11 个列出的模型，全部失败
- 账户显示有 $100M 限制，但仍然无法使用

技术细节：
- API 端点: https://anyrouter.top/v1/chat/completions
- 测试的模型: gpt-5-codex, claude-3-5-sonnet-20241022, 等
- HTTP 状态码: 404 Not Found
- 错误信息: {"error":"当前 API 不支持所选模型 gpt-5-codex","type":"error"}

请求支持：
- 如何启用模型访问权限？
- 是否需要特殊配置或订阅？
- 账户是否需要审核或激活？
```

### 🔄 方案 3: 查找 AnyRouter 文档

搜索 AnyRouter 的：
- 快速入门指南
- API 使用文档
- 常见问题 FAQ
- 社区论坛或讨论

关键词：
- "当前 API 不支持所选模型"
- "如何启用模型"
- "模型访问权限"
- "账户激活"

### ✅ 方案 4: 使用 MiniMax（临时方案）

您的 MiniMax 配置已经可用且工作正常：

```bash
# 使用 Codex CLI 切换到 MiniMax
# 编辑 ~/.codex/config.toml
model = "MiniMax-M2"
model_provider = "minimax"
```

然后：
```bash
codex exec "what is 2+2"
```

或使用 ai-codex-starter：
```bash
codex-start minimax exec "what is 2+2"
```

## 技术分析

### 为什么显示 OpenAI 的错误？

Codex CLI 输出：
```
ERROR: To use Codex with your ChatGPT plan, upgrade to Plus
```

这可能是因为：

1. **Codex CLI 的错误映射**
   - Codex CLI 可能将 404 错误统一映射为这个通用错误
   - `wire_api = "responses"` 配置可能影响错误处理

2. **AnyRouter 的错误转发**
   - AnyRouter 可能将某些错误转换为 OpenAI 兼容格式
   - 但错误消息不够准确

3. **实际问题被掩盖**
   - 真实原因是"当前 API 不支持所选模型"
   - 但通过 Codex CLI 看到的是映射后的错误

### API 响应分析

**成功的请求** (GET /v1/models):
```
Status: 200 OK
Returns: List of 11 models with permissions
```

**失败的请求** (POST /v1/chat/completions):
```
Status: 404 Not Found
Body: {"error":"当前 API 不支持所选模型 gpt-5-codex","type":"error"}
```

404 通常表示：
- 资源不存在
- 路由不匹配
- **权限不足（可能）**

但 "当前 API 不支持所选模型" 更像是权限或配置问题。

## 结论

| 状态 | 说明 |
|------|------|
| ✅ **配置正确** | ai-codex-starter 和 Codex CLI 都配置正确 |
| ✅ **Token 有效** | 新旧 Token 都能认证，都有充足额度 |
| ❌ **模型无法访问** | 这是 **AnyRouter 账户层面的问题** |

### 核心问题

**AnyRouter 账户没有模型访问权限**

不是配置问题，不是 Token 额度问题，而是：
- 账户可能需要激活
- 可能需要申请模型访问权限
- 可能需要特定订阅
- 可能是新账户的限制期

### 下一步

**必须联系 AnyRouter 支持**或在其控制台中找到"启用模型访问"的选项。

在解决 AnyRouter 账户问题之前，建议使用 **MiniMax**（已配置且可用）。

## 文件更新记录

### 已更新配置
- ✅ `~/.codex/auth.json` - 使用新 Token
- ✅ `~/.ai-codex-profiles.json` - 添加 anyrouter 凭证

### 测试脚本
- `test-new-token-api.js` - 直接 API 测试
- `check-new-token-status.js` - 账户状态检查
- `update-new-token.js` - 配置更新脚本

所有配置文件都已正确更新，一旦 AnyRouter 账户问题解决，应该可以立即工作。
