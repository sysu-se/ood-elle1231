import { createSudoku } from './sudoku.js';
import { createGame } from './game.js';

// 导出基础工厂函数
export { createSudoku, createGame };

/**
 * 从 JSON 数据还原 Sudoku 实例
 */
export function createSudokuFromJSON(json) {
    if (!json || !json.grid) return null;
    return createSudoku(json.grid);
}

/**
 * 从 JSON 数据还原 Game 实例（包含历史记录）
 */
export function createGameFromJSON(json) {
    if (!json || !json.history) return null;

    // 1. 将所有的历史记录 JSON 还原为 Sudoku 实例
    const historyInstances = json.history.map(h => createSudokuFromJSON(h));

    // 2. 传入 createGame。注意：sudoku 应该是当前指针指向的那个实例
    // 假设你的 json.pointer 是当前的索引
    return createGame({
        sudoku: historyInstances[json.pointer], 
        history: historyInstances,
        pointer: json.pointer
    });
}