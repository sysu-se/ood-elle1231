// src/node_modules/@sudoku/domain/game.js

export function createGame({ sudoku, history = null, pointer = 0 }) {
    // 初始化时确保是克隆体，防止污染外部数据
    let _history = history || [sudoku.clone()];
    let _pointer = pointer;
    let _exploreSnapshot = null;

    return {
        getSudoku: () => _history[_pointer],

        guess(move) {
            // 重要：先基于当前状态克隆一个新的数独
            const nextSudoku = _history[_pointer].clone();
            // 在新数独上执行修改
            nextSudoku.guess(move);
            
            // 正常推入历史栈
            _history = _history.slice(0, _pointer + 1);
            _history.push(nextSudoku);
            _pointer++;
        },

        undo() { if (this.canUndo()) _pointer--; },
        redo() { if (this.canRedo()) _pointer++; },

        enterExplore() { _exploreSnapshot = _pointer; },
        discardExplore() {
            if (_exploreSnapshot !== null) {
                _pointer = _exploreSnapshot;
                _history = _history.slice(0, _pointer + 1);
                _exploreSnapshot = null;
            }
        },
        commitExplore() { _exploreSnapshot = null; },
        isExploring: () => _exploreSnapshot !== null,
        canUndo: () => _pointer > 0,
        canRedo: () => _pointer < _history.length - 1,
        
        toJSON: () => ({
            history: _history.map(s => s.toJSON()),
            pointer: _pointer
        })
    };
}