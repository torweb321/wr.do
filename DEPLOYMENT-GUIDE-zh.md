# WR.DO 二级域名管理系统部署指南

## 目录
1. [项目概述](#项目概述)
2. [环境准备](#环境准备)
3. [本地开发环境搭建](#本地开发环境搭建)
4. [生产环境部署](#生产环境部署)
5. [Cloudflare 配置](#cloudflare-配置)
6. [系统配置](#系统配置)
7. [管理员设置](#管理员设置)
8. [使用说明](#使用说明)
9. [维护与监控](#维护与监控)
10. [故障排除](#故障排除)
11. [附录](#附录)

## 项目概述

WR.DO 是一个功能强大的二级域名管理系统，提供以下核心功能：
- 短链接生成与管理
- DNS 记录管理
- 临时邮箱服务
- 用户权限管理
- API 接口支持

## 环境准备

### 1.1 硬件要求
- CPU: 2核或更高
- 内存: 4GB 或更高
- 存储: 20GB 可用空间
- 带宽: 100Mbps 或更高

### 1.2 软件要求
- Node.js 18+
- PostgreSQL 13+
- pnpm 8+
- Git

### 1.3 账户准备
1. [GitHub 账户](https://github.com/signup)
2. [Vercel 账户](https://vercel.com/signup)
3. [Cloudflare 账户](https://dash.cloudflare.com/sign-up)
4. 一个已注册的域名

## 本地开发环境搭建

### 2.1 克隆代码库
```bash
git clone https://github.com/oiov/wr.do.git
cd wr.do
```

### 2.2 安装依赖
```bash
pnpm install
```

### 2.3 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下参数：
```env
# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/wrdo?schema=public"

# 开发配置
NODE_ENV=development
```

### 2.4 数据库设置
1. 创建 PostgreSQL 数据库
2. 运行数据库迁移：
```bash
npx prisma migrate dev
```

### 2.5 启动开发服务器
```bash
pnpm dev
```

## 生产环境部署

### 3.1 Vercel 部署
1. 登录 [Vercel 控制台](https://vercel.com/dashboard)
2. 点击 "New Project" > "Import Git Repository"
3. 选择 WR.DO 仓库
4. 配置环境变量（参考本地开发环境）
5. 部署项目

### 3.2 环境变量配置
在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| NODE_ENV | 环境类型 | production |
| NEXTAUTH_SECRET | 认证密钥 | 随机字符串 |
| NEXTAUTH_URL | 认证回调URL | https://your-domain.com |
| DATABASE_URL | 数据库连接字符串 | postgresql://... |
| CLOUDFLARE_API_TOKEN | Cloudflare API 令牌 | - |
| CLOUDFLARE_ACCOUNT_ID | Cloudflare 账户ID | - |
| CLOUDFLARE_ZONE_ID | Cloudflare 区域ID | - |

## Cloudflare 配置

### 4.1 添加域名
1. 登录 Cloudflare 控制台
2. 添加您的域名
3. 按照提示更新域名服务器

### 4.2 创建 API 令牌
1. 进入 [API 令牌页面](https://dash.cloudflare.com/profile/api-tokens)
2. 创建自定义令牌，添加以下权限：
   - Zone.DNS:Edit
   - Zone.DNS:Read
   - Zone.Zone:Read
   - Zone.Workers:Edit (如果使用 Workers)

### 4.3 配置 DNS 记录
添加以下 DNS 记录：

| 类型 | 名称 | 内容 | TTL | 代理状态 |
|------|------|------|-----|---------|
| A    | @    | Vercel IP | Auto | 代理 |
| CNAME | www  | your-domain.com | Auto | 代理 |
| A    | *    | Vercel IP | Auto | 代理 |

## 系统配置

### 5.1 管理员账户设置
1. 部署完成后访问管理后台
2. 使用管理员凭据登录
3. 创建管理员账户：
```bash
# 在 Vercel 终端或服务器上执行
npx prisma db execute --file ./prisma/seed-admin.sql
```

### 5.2 邮件服务配置
编辑 `.env` 文件添加邮件服务配置：
```env
# SMTP 配置
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
SMTP_FROM='WR.DO <noreply@your-domain.com>'
```

## 使用说明

### 6.1 登录系统
1. 访问您的部署地址
2. 点击登录按钮
3. 使用配置的认证方式登录

### 6.2 添加 DNS 记录
1. 导航到 DNS 管理页面
2. 点击 "添加记录"
3. 填写记录详情：
   - 类型（A, CNAME, MX 等）
   - 名称（子域名）
   - 内容（目标地址）
   - TTL（生存时间）

### 6.3 管理用户
1. 进入用户管理
2. 添加/编辑/删除用户
3. 设置用户角色和权限

## 维护与监控

### 7.1 定期备份
```bash
# 数据库备份
pg_dump -U username -d dbname > backup_$(date +%Y%m%d).sql

# 配置文件备份
tar -czvf config_backup_$(date +%Y%m%d).tar.gz .env prisma/
```

### 7.2 监控设置
1. 配置 Vercel Analytics
2. 设置错误监控（如 Sentry）
3. 配置性能监控

## 故障排除

### 8.1 常见问题

#### 问题：DNS 记录不生效
- 检查 DNS 传播状态
- 确认 TTL 设置
- 清除本地 DNS 缓存

#### 问题：数据库连接失败
- 检查 DATABASE_URL 格式
- 确认数据库服务运行状态
- 检查防火墙设置

### 8.2 日志查看
```bash
# Vercel 日志
vercel logs

# 本地开发日志
pnpm dev
```

## 附录

### A. 环境变量参考
完整的环境变量列表见 `.env.example` 文件

### B. 命令行工具
```bash
# 数据库迁移
npx prisma migrate dev  # 开发环境
npx prisma migrate deploy  # 生产环境

# 生成 Prisma 客户端
npx prisma generate
```

### C. 更新系统
1. 拉取最新代码
2. 更新依赖
3. 运行数据库迁移
4. 重新部署

```bash
git pull origin main
pnpm install
npx prisma migrate deploy
```

### D. 获取支持
- [GitHub Issues](https://github.com/oiov/wr.do/issues)
- [Discord 社区](https://discord.gg/AHPQYuZu3m)

## 安全建议

1. 定期更新依赖
2. 使用强密码
3. 限制 API 访问
4. 启用双因素认证
5. 定期审计日志

## 许可证

本项目采用 [MIT 许可证](LICENSE.md)

---
文档最后更新: 2025-05-15
