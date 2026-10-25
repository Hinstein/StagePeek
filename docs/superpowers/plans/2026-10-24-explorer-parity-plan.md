# 场馆探索能力对齐 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 补齐 2D/3D 场馆探索核心能力并完成移动端工作区适配。

**Architecture:** 复用现有 SVG、Three.js 和 `viewer.mjs`，新增统一 explorer 状态；2D 工具只变换视图，3D 工具只变换相机和可视图层，均不修改座位数据。

**Tech Stack:** 原生 ES modules、Three.js、SVG、CSS、Node test。

**Spec:** `docs/superpowers/specs/2026-10-24-explorer-parity-design.md`

## Global Constraints

- 保留 197 个场馆、582 个布局和 138,856 条来源座位身份与 XYZ。
- 估算几何继续标记为估算，不能提升为已校准。
- 不引入新的 UI 框架或复制参考站私有资产。
- 任何舞台/看台变化必须继续通过全量碰撞审计。

## Review Focus

- 2D 旋转/缩放后点击分区仍命中原分区。
- 切换层级后当前选择不会跳到另一层。
- 3D 屋顶开关不会改变座椅或舞台坐标。
- 未定位座位时观众视角保持禁用，估算座位不会显示为来源坐标。
- 窄屏下工具不遮挡场景和定位卡片。

### Task 1: 2D map controls

**Files:**
- Modify: `public/index.html`
- Modify: `public/app.mjs`
- Modify: `public/style.css`
- Test: `tests/app-selection.test.mjs`

- [x] Add zoom in/out, rotation and reset controls with accessible labels.
- [x] Store map transform in explorer state and apply it to SVG viewBox/transform.
- [x] Keep section selection and tier switching stable after transforms.
- [x] Add tests for transform reset and tier selection persistence.

### Task 2: 3D roof and phone framing

**Files:**
- Modify: `public/index.html`
- Modify: `public/viewer.mjs`
- Modify: `public/style.css`
- Test: `tests/geometry.test.mjs`

- [x] Add a roof structure layer derived from venue floor/radius and profile roofHeight; mark it as illustrative.
- [x] Add phone framing overlay and toggle state without changing camera coordinates.
- [x] Expose `toggleRoof()` and `togglePhoneFrame()` from `createViewer`.
- [x] Test that toggles do not alter seat records or stage rectangles.

### Task 3: Mobile explorer shell

**Files:**
- Modify: `public/index.html`
- Modify: `public/style.css`
- Modify: `public/app.mjs`
- Test: `tests/local.test.mjs`

- [x] Add compact explorer toolbar and bottom action rail at widths below 800px.
- [x] Ensure 2D/3D switch and location summary remain reachable without scrolling the entire page.
- [x] Preserve desktop layout and keyboard focus order.
- [x] Add responsive DOM assertions for tool labels and visibility.

### Task 4: Verification and evidence

**Files:**
- Create: `docs/audits/explorer-parity-2026-10-24.md`
- Update: `docs/audits/scenes-after.json`

- [x] Run focused tests after each task.
- [x] Run `node --test tests/*.test.mjs`.
- [x] Run full 197 venue / 582 layout scene audit.
- [x] Browser-check Tokyo Garden Theater, Ajinomoto Stadium, Tottenham, and KSPO DOME on desktop and narrow viewport.
- [x] Record differences and remaining accuracy limits in the audit.
