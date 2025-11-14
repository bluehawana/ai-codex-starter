# Moonshot API 测试结果

## 测试时间
2025-11-14

## API Key 信息
- **Token**: `sk-Vw1qYUn4rDpVLLaiY61GYEcUbY2VSM9epeB0F5HmJXWpNbem`
- **Base URL**: `https://api.moonshot.cn/v1`
- **Model**: `moonshot-v1-8k`

## 配置状态 ✅

### 已完成配置

1. **ai-codex-starter** (`~/.ai-codex-profiles.json`)
   ```json
   {
     "name": "moonshot",
     "baseUrl": "https://api.moonshot.cn/v1",
     "model": "moonshot-v1-8k",
     "modelProvider": "moonshot"
   }
   ```

2. **Codex CLI** (`~/.codex/config.toml`)
   ```toml
   model = "moonshot-v1-8k"
   model_provider = "moonshot"

   [model_providers.moonshot]
   name = "Moonshot AI"
   base_url = "https://api.moonshot.cn/v1"
   wire_api = "chat"

   [profiles.moonshot]
   model = "moonshot-v1-8k"
   model_provider = "moonshot"
   ```

3. **Codex Auth** (`~/.codex/auth.json`)
   ```json
   {
     "OPENAI_API_KEY": "sk-Vw1qYUn4rDpVLLaiY61GYEcUbY2VSM9epeB0F5HmJXWpNbem"
   }
   ```

## 测试结果 ❌

### API 认证失败

所有 API 端点都返回 **401 Unauthorized**：

```json
{
  "error": {
    "message": "Invalid Authentication",
    "type": "invalid_authentication_error"
  }
}
```

### 测试的端点

1. ❌ `GET /v1/models` - 401
2. ❌ `POST /v1/chat/completions` - 401
3. ❌ `GET /v1/users/me` - 401

## 问题分析

### 可能的原因

1. **API Key 无效或已过期**
   - Token 格式看起来正确（`sk-` 开头）
   - 但 Moonshot API 拒绝认证

2. **API Key 来源问题**
   - 需要确认这个 Key 是从哪里获取的
   - Moonshot 官方平台: https://platform.moonshot.cn/
   - 需要在正确的平台注册和获取

3. **API Key 状态问题**
   - 可能已被撤销或禁用
   - 可能需要激活或验证账户
   - 可能有使用限制

4. **Base URL 或认证方式问题**
   - Base URL: `https://api.moonshot.cn/v1` 应该是正确的
   - 认证方式: `Authorization: Bearer {token}` 是标准格式

## 与其他 Provider 对比

| Provider | API Key 格式 | 认证状态 | 模型访问 |
|----------|--------------|----------|----------|
| **Moonshot** | sk-Vw1q...Nbem | ❌ 401 Invalid Auth | ❌ 无法测试 |
| AnyRouter (旧) | sk-tvNH...N0Dw | ✅ 200 OK | ❌ 模型无权限 |
| AnyRouter (新) | sk-Ugah...D5E2 | ✅ 200 OK | ❌ 模型无权限 |
| MiniMax | JWT token | ✅ 200 OK | ✅ 工作正常 |

## 建议的解决方案

### 🔍 方案 1: 验证 API Key 来源

请确认：
1. 这个 API Key 是从 https://platform.moonshot.cn/ 获取的吗？
2. 账户是否已完成注册和验证？
3. API Key 是否在控制台中显示为"活跃"状态？

### 🔄 方案 2: 重新生成 API Key

登录 Moonshot 平台：
1. 访问 https://platform.moonshot.cn/
2. 进入 API Keys 管理页面
3. 撤销当前 Key（如果存在）
4. 创建新的 API Key
5. 复制新的 Key 并重新测试

### 📞 方案 3: 检查账户状态

在 Moonshot 控制台检查：
1. 账户是否已激活
2. 是否需要实名认证
3. 是否有余额或配额限制
4. API 访问权限是否已开启

### 🔧 方案 4: 尝试不同的 Base URL

Moonshot 可能有多个 API 端点，尝试：
- `https://api.moonshot.cn/v1` (当前使用)
- `https://api.moonshot.ai/v1` (备选)
- 查看 Moonshot 最新文档确认正确的 URL

### ✅ 方案 5: 使用 MiniMax（已验证可用）

MiniMax 配置完整且工作正常：

```bash
# 方法 1: 使用 Codex 直接切换
# 编辑 ~/.codex/config.toml，改为：
model = "MiniMax-M2"
model_provider = "minimax"

# 方法 2: 使用 ai-codex-starter
codex-start minimax exec "your command"
```

## 下一步行动

### 立即检查清单

- [ ] 确认 API Key 来源（Moonshot 官方平台）
- [ ] 登录 Moonshot 控制台查看 Key 状态
- [ ] 检查账户是否已激活/验证
- [ ] 查看是否有余额或配额
- [ ] 查看 Moonshot 最新文档确认 API 端点

### 如果 API Key 确认有效

如果您确认 API Key 应该是有效的，可能的问题：

1. **时区/时间问题**: 某些 API 对请求时间戳敏感
2. **IP 限制**: Moonshot 可能有 IP 白名单限制
3. **请求头问题**: 可能需要额外的 headers

### 测试脚本

如果您获得新的 API Key，可以用这个脚本快速测试：

```bash
# 更新 Key
node setup-moonshot-config.js  # 修改脚本中的 Key

# 测试 API
node test-moonshot-api.js
```

## 总结

| 项目 | 状态 | 说明 |
|------|------|------|
| **配置** | ✅ 完成 | ai-codex-starter 和 Codex CLI 都已配置 |
| **API Key** | ❌ 无效 | 返回 401 Invalid Authentication |
| **建议** | 🔄 重新获取 | 从 Moonshot 官方平台重新获取有效的 API Key |

当前可用的 Provider：
- ✅ **MiniMax** - 完全工作
- ⏸️ **Moonshot** - 等待有效 API Key
- ⏸️ **AnyRouter** - 账户无模型权限

## 参考链接

- Moonshot 官网: https://www.moonshot.cn/
- Moonshot 平台: https://platform.moonshot.cn/
- Moonshot 文档: https://platform.moonshot.cn/docs

## 配置文件位置

- Codex 配置: `C:\Users\BLUEH\.codex\config.toml`
- Codex 认证: `C:\Users\BLUEH\.codex\auth.json`
- ai-codex-starter: `C:\Users\BLUEH\.ai-codex-profiles.json`
