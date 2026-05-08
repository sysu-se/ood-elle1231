// src/node_modules/@sudoku/domain/sudoku.js

export function createSudoku(input) {
    let grid = input.map(row => [...row]);

    return {
        getGrid: () => grid,
        
        // 兼容性解构：不管是 x/y 还是 row/col，通通拿下
        guess({ x, y, row, col, value }) {
            // 自动适配测试脚本的 row/col 或 x/y
            const r = row !== undefined ? row : y;
            const c = col !== undefined ? col : x;

            if (r !== undefined && c !== undefined) {
                grid[r][c] = value;
            }
            return this; // 这里返回 this 是没问题的，因为 game.js 现在会先 clone
        },

        getCandidates(y, x) {
            // 这里的参数最好也兼容一下，或者确保调用处统一
            const r = y; 
            const c = x;
            if (grid[r][c] !== 0) return [];
            const forbidden = new Set();
            for (let i = 0; i < 9; i++) {
                forbidden.add(grid[r][i]);
                forbidden.add(grid[i][c]);
                const blockR = Math.floor(r / 3) * 3 + Math.floor(i / 3);
                const blockC = Math.floor(c / 3) * 3 + (i % 3);
                forbidden.add(grid[blockR][blockC]);
            }
            return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !forbidden.has(n));
        },

        clone() {
            return createSudoku(grid.map(row => [...row]));
        },

        toString() {
            return grid.map(row => row.join(' ')).join('\n');
        },

        toJSON: () => ({ grid })
    };
}