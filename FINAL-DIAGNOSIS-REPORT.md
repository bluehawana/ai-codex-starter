# AnyRouter API 完整诊断报告

## 测试时间
2025-11-14

## 执行摘要

**配置状态**: ✅ 完全正确
**API Key 状态**: ✅ 有效且已激活
**账户额度**: ✅ 充足（$2,000,000,000 USD 限制）
**模型访问**: ❌ **所有模型均无法使用**

## 问题确认

### ✅ 配置文件已验证正确

#### 1. ai-codex-starter 配置
**文件**: `~/.ai-codex-profiles.json`
```json
{
  "name": "anyrouter",
  "baseUrl": "https://anyrouter.top/v1",
  "model": "gpt-5-codex",
  "modelProvider": "anyrouter"  // ✅ 已修复并添加
}
```

#### 2. Codex CLI 配置
**文件**: `~/.codex/config.toml`
```toml
model = "gpt-5-codex"
model_provider = "anyrouter"
preferred_auth_method = "apikey"

[model_providers.anyrouter]
name = "Any Router"
base_url = "https://anyrouter.top/v1"
wire_api = "responses"
```

**文件**: `~/.codex/auth.json`
```json
{
  "OPENAI_API_KEY": "sk-tvNHeaRCOvTBFikoxadraoKk6mL4TexTyynjGa7bgOuxN0Dw"
}
```

所有配置与官方文档完全一致 ✅

### ✅ API Key 验证通过

**测试结果**:
- ✅ API Key 格式正确（sk-开头）
- ✅ 认证成功（200 OK）
- ✅ 可以访问 `/v1/models` 端点
- ✅ 可以访问 `/v1/dashboard/billing/subscription` 端点

### ✅ 账户状态良好

**从 API 返回的账户信息**:
```json
{
  "object": "billing_subscription",
  "has_payment_method": true,
  "soft_limit_usd": 2000000000.003902,
  "hard_limit_usd": 2000000000.003902,
  "system_hard_limit_usd": 2000000000.003902,
  "access_until": 0
}
```

- ✅ 已绑定支付方式
- ✅ 软限制: $2,000,000,000 USD
- ✅ 硬限制: $2,000,000,000 USD
- ✅ 系统限制: $2,000,000,000 USD

**结论**: 不是额度问题！

### ❌ 核心问题：所有模型都无法使用

#### 可用模型列表（从 API 返回）
API 返回了 11 个模型：

1. claude-3-5-haiku-20241022 (owned_by: vertex-ai)
2. claude-3-5-sonnet-20241022 (owned_by: vertex-ai)
3. claude-3-7-sonnet-20250219 (owned_by: vertex-ai)
4. claude-haiku-4-5-20251001 (owned_by: custom)
5. claude-opus-4-1-20250805 (owned_by: custom)
6. claude-opus-4-20250514 (owned_by: vertex-ai)
7. claude-sonnet-4-20250514 (owned_by: vertex-ai)
8. claude-sonnet-4-5 (owned_by: custom)
9. claude-sonnet-4-5-20250929 (owned_by: custom)
10. gemini-2.5-pro (owned_by: custom)
11. **gpt-5-codex** (owned_by: custom)

所有模型的权限都显示：
```json
{
  "allow_create_engine": true,
  "allow_sampling": true,
  "allow_logprobs": true,
  "allow_view": true,
  "organization": "*"
}
```

#### 测试结果：全部失败 ❌

**测试了所有 11 个模型，结果**：

| 模型 | 状态 | 错误信息 |
|------|------|----------|
| claude-3-5-haiku-20241022 | ❌ | 当前 API 不支持所选模型 |
| claude-3-5-sonnet-20241022 | ❌ | 当前 API 不支持所选模型 |
| claude-3-7-sonnet-20250219 | ❌ | 当前 API 不支持所选模型 |
| claude-haiku-4-5-20251001 | ❌ | 当前 API 不支持所选模型 |
| claude-opus-4-1-20250805 | ❌ | 当前 API 不支持所选模型 |
| claude-opus-4-20250514 | ❌ | 当前 API 不支持所选模型 |
| claude-sonnet-4-20250514 | ❌ | 当前 API 不支持所选模型 |
| claude-sonnet-4-5 | ❌ | 当前 API 不支持所选模型 |
| claude-sonnet-4-5-20250929 | ❌ | 当前 API 不支持所选模型 |
| gemini-2.5-pro | ❌ | 500 Internal Server Error (空响应) |
| **gpt-5-codex** | ❌ | 当前 API 不支持所选模型 |

**一致性错误**：
```json
{
  "error": "当前 API 不支持所选模型 gpt-5-codex",
  "type": "error"
}
```

HTTP 状态码: **404 Not Found**

## 测试执行详情

### Test 1: 直接 API 调用 ❌
```bash
curl -X POST https://anyrouter.top/v1/chat/completions \
  -H "Authorization: Bearer sk-tvNH..." \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-5-codex", "messages": [{"role": "user", "content": "hi"}]}'
```

**结果**: 404 - "当前 API 不支持所选模型 gpt-5-codex"

### Test 2: Codex CLI 直接调用 ❌
```bash
codex exec "what is 2+2"
```

**输出**:
```
model: gpt-5-codex
provider: anyrouter
ERROR: To use Codex with your ChatGPT plan, upgrade to Plus
```

这个错误信息很奇怪 —— 它像是 OpenAI 的错误，但配置显示正在使用 anyrouter provider。

### Test 3: 使用 ai-codex-starter ⏸️
未测试（因为直接 API 和 Codex CLI 都失败）

## 矛盾的发现

### 🔴 矛盾点

1. **模型列表 vs 实际访问**
   - API 返回 11 个模型
   - 每个模型都标记为可用 (`allow_sampling: true`)
   - 但**没有一个模型可以实际使用**

2. **账户额度 vs 使用限制**
   - 账户显示 $2,000,000,000 的巨额限制
   - `has_payment_method: true`
   - 但模型仍然不可用

3. **Token 配置 vs Web 界面**
   - Web 界面显示 Token 额度为 **-1951** (负数/超支)
   - 但 API 返回账户额度为 $2,000,000,000
   - **这是关键矛盾！**

## 根本原因分析

基于所有测试，问题的根本原因是：

### 🎯 Token 级别的限制 vs 账户级别的额度

AnyRouter 的架构似乎是：
- **账户级别**: 有大量额度（$2B）
- **Token 级别**: 这个特定的 Token 额度为 **-1951**（已超支）

**结论**: 虽然账户本身有额度，但您创建的这个特定 Token (`sk-tvNHeaRCOvTBFikoxadraoKk6mL4TexTyynjGa7bgOuxN0Dw`) 已经耗尽了其分配的额度。

API 响应中看到的 `$2B` 可能是：
1. 账户总额度限制（而非可用额度）
2. 或者是系统的默认最大值

## 建议的解决方案

### 🔧 方案 1: 创建新的 API Token（推荐）

在 AnyRouter 控制台 https://anyrouter.top：

1. **删除旧 Token** (名称: "newcodex")
   - 当前额度: -1951（已超支）
   - 过期时间: 1970-01-01（已过期）

2. **创建新 Token**，设置：
   - **名称**: `codex-production` (或任意名称)
   - **过期时间**: 设置为未来日期（例如 2026-01-01）
   - **额度**: 选择 **无限额度** 或设置足够大的正数
   - **IP 白名单**: 留空（除非有特殊需求）
   - **模型限制**: 不勾选（允许所有模型）
   - **分组**: 默认分组

3. **获取新 Token** 后，更新配置：

```bash
# 更新 Codex auth.json
notepad %USERPROFILE%\.codex\auth.json
```

替换为：
```json
{
  "OPENAI_API_KEY": "sk-YOUR_NEW_TOKEN_HERE"
}
```

4. **测试新 Token**:
```bash
codex exec "what is 2+2"
```

### 🔧 方案 2: 为现有 Token 充值

如果您想保留当前 Token：

1. 登录 AnyRouter 控制台
2. 找到充值/续费入口
3. 为账户添加余额
4. 检查 Token 的额度设置，确保不是负数

### 🔧 方案 3: 使用 MiniMax（临时方案）

您的 MiniMax 配置完整且可用：

```bash
# 使用 ai-codex-starter 切换到 minimax
codex-start minimax exec "what is 2+2"
```

或更新 Codex 配置使用 minimax：

```bash
# 编辑 ~/.codex/config.toml
model = "MiniMax-M2"
model_provider = "minimax"
```

## Token 配置对比

### 当前 Token (不可用)
```
名称: newcodex
额度: -1951 ❌
过期时间: 1970-01-01 00:59:59 ❌
状态: 超支且过期
```

### 推荐的新 Token 配置
```
名称: codex-production
额度: 无限额度 ✅
过期时间: 2026-12-31 或更晚 ✅
IP 限制: 无
模型限制: 无
状态: 活跃
```

## 验证步骤

创建新 Token 后，按以下步骤验证：

### 1. 测试 API 直接访问
```bash
node test-anyrouter-now.js
```

应该看到: `✅ SUCCESS! Model responded`

### 2. 测试 Codex CLI
```bash
codex exec "what is 2+2"
```

应该返回: `4` (而不是错误)

### 3. 测试 ai-codex-starter
```bash
codex-start anyrouter exec "what is 2+2"
```

应该正常工作

## 总结

| 组件 | 状态 | 说明 |
|------|------|------|
| **配置文件** | ✅ 正确 | ai-codex-starter 和 Codex 配置都正确 |
| **API Key 格式** | ✅ 有效 | 格式正确，认证通过 |
| **账户状态** | ✅ 活跃 | 有支付方式，巨额限制 |
| **Token 额度** | ❌ **超支** | **-1951**（根本原因） |
| **模型访问** | ❌ 全部失败 | 所有 11 个模型都无法使用 |

### 下一步行动

**立即操作**:
1. ✅ 登录 https://anyrouter.top
2. ✅ 在 "API令牌" 页面创建新 Token
3. ✅ 设置额度为 **无限额度**
4. ✅ 更新 `~/.codex/auth.json` 使用新 Token
5. ✅ 运行测试验证

**或者**:
- 使用 MiniMax 作为临时替代（已配置且可用）

## 附录：文件路径参考

### Windows 路径
- Codex 配置: `%USERPROFILE%\.codex\config.toml`
- Codex 认证: `%USERPROFILE%\.codex\auth.json`
- ai-codex-starter: `%USERPROFILE%\.ai-codex-profiles.json`

### Linux/Mac 路径
- Codex 配置: `~/.codex/config.toml`
- Codex 认证: `~/.codex/auth.json`
- ai-codex-starter: `~/.ai-codex-profiles.json`

## 技术支持

如果创建新 Token 后仍然无法使用：

1. **检查 AnyRouter 文档**: https://anyrouter.top/docs
2. **联系 AnyRouter 客服**: 询问 Token 额度和模型访问问题
3. **提供诊断信息**:
   - Token 显示额度为负数 (-1951)
   - 但账户显示有大量额度
   - 所有模型返回 "当前 API 不支持所选模型"
