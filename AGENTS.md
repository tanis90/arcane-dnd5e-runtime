# AGENTS.md — DND5E Runtime Owner Contract

本仓是 DND5E 2014 执行 runtime 的唯一 owner。任何 agent 在本仓工作，先遵守本契约；它不替代产品代码、manifest 和 CI。

## 权责边界

- 本仓只负责：完整 DND5E 执行 runtime SDK、机制 DSL/compiler、共享 automation contracts、浏览器 initializer、公开 API 与 lifecycle。
- 本仓不负责 Auto 内容包（spell/item/actor/compendium/翻译/图片/世界数据），也不负责前端 runtimeHost。
- runtimeHost 属于前端：加载、校验、接线、初始化和 dispose 都在前端完成；不得在本仓或 Auto 内容包复制第二份 runtimeHost，也不得复制第二套 runtime。
- 前端只对本仓产物做 manifest/entrypoint/生命周期校验与真实集成 smoke；不替本仓实现规则、DSL 或 runtime。
- 一个 runtime 实现：`packages/dnd5e-runtime/src/automation.js` 是唯一完整 runtime 源；adapter 只加宿主接线，不复制规则。

## 版本轴

- `runtimeSdkApi`（SDK 暴露的 factory、public API、initializer/lifecycle surface）与 Foundry generation、`hostApi`、`contentRevision` 是不同轴，不得互相冒充。
- Foundry generation 是运行环境；`hostApi` 是宿主提供的 game/Hooks/settings/content 接口范围；`contentRevision` 是 Auto 内容包自身的修订。三者变化都不自动等于 runtime 变化。
- 不能以 Auto 版本变化冒充 runtime 变化，也不能因此要求后端发版或战役迁移；runtime 变更只在本仓的 SDK contract/版本轴内声明。
- 当前 SDK surface 由包版本、manifest 的 `schemaVersion`/`runtimeKind`/`factoryName` 与 initializer 契约共同定义；不要自行发明 manifest 字段，也不要用 Foundry 版本号替代。
- 版本字符串不是唯一身份：同一版本不同字节必须发新 release；禁止覆盖已发布 artifact。

## 初始化与宿主契约

- 必须遵循 README 的完整 initializer 语义：`createDnd5eRuntime()` 返回 manifest 与 `initializer`；宿主通过 `evaluateInitializer({source, manifest, moduleId})` 加载并执行，SDK 只读字节、不 eval、不访问 world。
- `initializeDnd5eRuntime({moduleId})` 是浏览器 initializer 的唯一 factory：same-module replacement 为 `standalone`；不同模块看到活跃 legacy Auto 时返回 `legacy` 且不注册 hooks；没有 spell-only fallback 或第二套规则实现。
- 重复初始化必须幂等并返回同一 runtime；部分失败必须移除已注册 hooks 并恢复 `ArcaneDnd5e2014SpellScripts`；`abortInitialization()` 只在 ready 前可用，ready 后必须拒绝。
- 不得引入 `buildSpellRuntime`、spell-only projection 或绕过 `evaluateInitializer` 的旁路 API；`createAuto2014Runtime` 只是同一完整 runtime 的兼容别名。

## 哈希与生成物

- `sourceHash`：`src/automation.js` 的 sha256，受 `src/source-baseline.json` 人工审查约束；CI 不得自动刷新 baseline。
- `buildHash`：本仓 build 生成的 `dist/dnd5e-runtime.mjs` 字节 hash；`artifactHash` 是交给前端/lock 的 artifact 字节 hash，对本 artifact 与 `buildHash` 相等，但不得与 source/manifest hash 混用。
- `manifestHash`：`dist/manifest.json` 字节的 sha256，由前端 lock 按 manifest 字节计算；manifest 内不声明该字段，不能拿 `sourceHash` 或 `buildHash` 冒充。
- `testedRuntimeSha256`：被测试的完整 runtime 副本的 provenance hash；当前等于 `sourceHash`，不能证明 wrapper、dist 或 manifest 的字节一致性。
- `dist/dnd5e-runtime.mjs` 与 `dist/manifest.json` 是生成物，禁止手改；生成与验证必须从同一 commit 的真实源构建，不能以旧 dist 或 Auto 包内 scripts 作为 source of truth。

## Owner 证据与回执

- owner 提供真实 initializer/API/hook/DSL/compiler 的独立安装、构建、测试与 owner 回执证据；至少覆盖 54 hook registrations、163 API keys、确定性 build、rollback、legacy ownership、compiler DSL → runtimePlan → availability。
- 真实 CI receipt 至少绑定完整 commit、`unit`/manifest identity（包版本、`schemaVersion`、`moduleId`、`contentPolicy`）与 artifact（`artifactHash`/`buildHash`）；前端 lock 再聚合 `manifestHash`、`hostApi`、`runtimeSdkApi`，不得只给 `result: "passed"`。
- release 身份：正式 A 类出件必须是 `release.tag`（自受保护 main 切出的 `release-*` tag）；完整 40 位 commit 只作证据/诊断与 CI 内部绑定，**不是**前端正式消费坐标，也不得替代 `release.tag`。禁止 `main`、`latest`、短 hash。`owner-ci.yml` 的 `testedCommit` 当前只接受完整 40-hex，传 tag 前必须先解析成 commit。
- 本地或非 Actions 运行只能得到 `runUrl: null`，不得冒充 CI 回执；任一步失败都不得写出 `result: "passed"`。
- A 类出件坐标是 GitHub Release（D2）：默认分支必须是 `main` 且 `main` 受保护（PR + required owner CI checks；禁直推/force-push/删除）；保护未启用或 tag 不在 main 祖先线时不得出件。只有自 main 切出的 `release-*` tag 才出件（`git merge-base --is-ancestor` 血统门），分支 push / PR / dispatch 只产出私有 run artifact，不得变成坐标。三件固定 asset（`dnd5e-runtime-sdk.zip` / `-manifest.json` / `-receipt.json`）由 `tools/owner-ci/release.mjs` 从被测 commit 的字节确定性生成，先草稿后发布；同一 release 身份只对应一份字节，禁止覆盖，修复必须出新 tag。消费方第五件 `dnd5e-runtime.manifest.json` 由前端 sync 工具生成，owner 侧只校验其绑定。receipt 是旁路证据：前端采纳时校验，但只上传报告，不回写 manifest、不改变发布身份，也不驱动前端回写。
- 不要求后端发版或战役迁移；不把未跑的真实集成 smoke 说成已认证，也不把 VM/compiler 通过说成 live Foundry 认证。

## 许可、恢复与回滚

- 公共源码保持 Apache-2.0 `LICENSE` 与 `NOTICE`；每个发布包保留自己的 `LICENSE`/`NOTICE`，不得伪造缺失文件或混入私有内容。
- 不得从其它 worktree 整树恢复或覆盖同一 release；不得手改 `dist/` 或 `source-baseline.json` 来“修复”证据。
- 保留旧 artifact 与匹配 manifest 供回滚；回滚恢复上一 pinned release 的源码/产物，而不是复制未审查的容器 runtime。

## 验证入口

- 权威入口：`README.md`、`docs/runtime-baseline.md`、`packages/dnd5e-runtime/dist/manifest.json`、`.github/workflows/owner-ci.yml`、`tools/verify-owner-release.mjs`、`tools/owner-ci/README.md`；不要堆历史 PR 状态。
- runtime 与 contracts 的 Node floor 是 `>=22.12`；compiler 显式 `>=24 <25`，用 `npm run test:compiler:node24` 验证；不要把 runtime/contracts 的 floor 统一抬到 24。
- 已核实的本地命令：

```sh
npm ci
npm run build
npm test
npm run test:compiler:node24
npm run pack:check
node tools/verify-owner-release.mjs --root . --commit "$(git rev-parse HEAD)" --receipt owner-ci-receipt.json
node tools/owner-ci/release.mjs inventory --root .
node tools/owner-ci/release.mjs assemble --root . --out-dir <dir-outside-repo>
node tools/owner-ci/release.mjs verify --artifact <dir>/dnd5e-runtime-sdk.zip --manifest <dir>/dnd5e-runtime-sdk-manifest.json --receipt <dir>/dnd5e-runtime-sdk-receipt.json --root .
```

- `git diff --check` 是发布卫生检查，不是 runtime 认证；`owner-ci.yml` 双 checkout（tooling `owner-meta` + tested `source`）各自 `npm ci`，source 依次 build/test/test:compiler:node24/pack:check，最后由 owner-meta 的 verifier 绑定 `source` 与完整 40-hex commit 并上传 receipt/tested dist。`sdk-artifact` 再按同一 commit 重建并出三件 SDK 产物（rebuild 与已提交 dist 逐字节一致才通过），`release-publish` 只在 `release-*` tag 上运行。
