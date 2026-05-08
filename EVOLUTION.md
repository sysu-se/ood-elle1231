```
# 系统演进与设计说明 (Evolution of Sudoku System)

## 1. 初始阶段 (Initial State)
在最初的设计中，数独系统仅仅是一个简单的二维数组包装器。所有的操作都是“原地修改”（In-place mutation），这导致了以下问题：
- **无法回溯**：一旦数字填错，无法通过逻辑记录恢复到之前的状态。
- **副作用风险**：数据在 UI 和逻辑层之间共享，一处修改可能导致不可预见的同步错误。

## 2. 引入状态快照管理 (State Snapshot Management)
为了实现作业要求的 **Undo/Redo** 功能，我们重构了核心逻辑，引入了类似于备忘录模式（Memento Pattern）的思想：

- **不可变性 (Immutability)**：每当用户进行一次有效操作（`guess`），系统通过 `clone()` 方法创建一个新的数独实例。
- **历史栈管理 (History Stack)**：`Game` 对象维护一个 `_history` 数组（快照列表）和一个 `_pointer`（当前状态指针）。
    - **Undo**: 简单地将指针前移 `_pointer--`。
    - **Redo**: 将指针后移 `_pointer++`。
    - **New Move**: 抹除当前指针之后的“未来”记录，推入新快照，确保历史线逻辑严密。

## 3. 探索模式的设计 (Explore Mode Evolution)
Homework 2 要求的“探索模式”是对历史管理逻辑的进一步升华。我们采用了 **隔离快照 (Isolated Snapshot)** 的方案：

- **切入点记录**：当进入探索模式时，系统记录当前的指针位置 `_exploreSnapshot = _pointer`。
- **分支处理**：在探索模式下的所有操作依然会记录在历史栈中，允许用户在探索期间也能进行 Undo/Redo。
- **Discard (舍弃)**：这是最关键的操作。系统将指针直接重置回 `_exploreSnapshot`，并使用 `slice` 彻底移除探索期间产生的所有“临时历史”，实现了真正的“无痕回退”。
- **Commit (确认)**：只需清空快照标记，让探索期间的记录正式并入主历史轴。

## 4. 健壮性与接口兼容 (Robustness & Compatibility)
在调试过程中，我们通过 **适配器逻辑** 解决了不同调用来源的接口差异：
- **参数兼容**：`sudoku.guess()` 同时识别 `{x, y}` 和 `{row, col}`，确保 Vitest 测试脚本和 Svelte UI 能够无缝对接。
- **解耦设计**：Domain 逻辑层完全不依赖 UI 框架，通过 Svelte Store 的 `set` 方法实现单向数据流刷新。

## 5. 总结 (Summary)
通过这次演进，系统从一个简单的“数据容器”转变为了一个**具有状态管理能力的领域模型**。这不仅满足了功能需求，更通过设计模式的应用，保证了系统的可测试性（Vitest 全绿）和用户体验（UI 响应迅速）。
```
