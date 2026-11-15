# 项目重新启动：主分支与工作区整理

2026-11-15。唯一开发工作树为 `/Users/lilinhai/Projects/seatpeep`，分支 `main`。生产固定目录优化提交 `5b58a6aa6397bb091414e2b4eeab49eaa90784c7`；后续 main 草稿合并不自动发布。

## 已合并

- `4253acd`：保留此前 integration 工作区中 10 个本地场馆草稿、21 个演出图参考及配套导入、边界测试和来源证据。演出参考保持 `localOnly:true`；生产发布清单仍为 39 馆。
- `400d156`：合并远端 main 的目录优化与管理后台修复记录。
- `28ea820`：以独立 `localDraftConsolidationReview` 记录本次翻译文件哈希，保留历史审查快照；忽略本地配置、缓存、工作树和归档。外部保留 HTML 按字节校验，未格式化改写。
- 完整测试 369 项：368 通过、0 失败、1 跳过（独立 PostgreSQL 集成库未配置）；构建及差异检查通过。188 个改动文件的常见密钥模式检查无命中。

## 已整理

| 原位置 | 处理 |
| --- | --- |
| `integration/main-venue-views` | 有效工作提交合并到 main，干净后移除工作树 |
| `integration/user-journey-release` | 目录优化已部署；运行时 events 缓存单独备份后恢复，移除工作树 |
| `~/.codex/worktrees/multilingual-20261027/seatpeep` | 旧导航改动已被新版替代；补丁及两份文档逐字节／SHA-256 核对后归档，移除工作树 |
| 三个失效 `/private/tmp` 发布工作树 | dry-run 核对后清理失效 Git 登记 |
| `integration/user-journey` | 无 Git 的旧预览副本移入私有归档 |
| 根目录旧研究工作区 | 完整补丁与未跟踪文件备份核验后，切回现代 main；保留本机环境与依赖 |

历史分支保留，不盲目重放过期实现。`codex/pre-restart-main-20261115` 保留整理前 main；`codex/preserved-research-workspace-20261104` 保留旧研究基线。`codex/main-venue-views-20261102` 的旧功能已有新版实现，其历史提交没有重复 cherry-pick。

## 私有归档与恢复

本机目录：`archives/2026-11-15-workspace-restart`（权限 700，Git 忽略，未上传）。

- `legacy/tracked.patch`：旧研究基线 `ab7c4e9` 的完整二进制补丁（约 21 MB）。
- `legacy/untracked-research.tar.gz`、`untracked-manifest.json`、`untracked-tree/`：5,081 个文件，源文件约 1.37 GB；归档与原文件哈希已逐一验证。
- `main/`、`multilingual/`：原状态、HEAD 和补丁；多语言两份未跟踪文档另附 SHA-256。
- `release/`：发布工作树的运行时 events 缓存及补丁。
- `preview-copy/`：旧本地预览副本。

恢复研究时在独立工作树检出相应 `head.txt` 的基线，先 `git apply --check` 再应用对应 `tracked.patch`，按 manifest 恢复未跟踪文件。不要直接把旧补丁套到当前 main。既有 `archives/2026-11-02-before-main-integration` 继续保留。

## 后续开发边界

从根目录 main 开新分支。新场馆和演出草稿仍需权利、来源、布局与真实视角复核，再单独授权发布；合入代码不代表扩大公开目录。生产发布使用固定 SHA，与 main 的研究迭代分开。真实邮件、支付及统计后台收录按既有部署记录继续跟进。
