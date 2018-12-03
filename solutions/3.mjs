import { Solution } from './solution';

class Patch {
    constructor(str) {
        const [ id, , offset, size ] = str.split(' ');

        const [ left, top ] =
            offset
                .substr(0, offset.length - 1)
                .split(',')
                .map(x => Number(x) - 1);

        const [ width, height ] =
            size
                .split('x')
                .map(Number);

        this.id = Number(id.substr(1));
        this.dimensions = { width, height };
        this.offset = { top, left };
        this.overlaps = false;
    }

    draw(arr, obj = null) {
        const { left, top } = this.offset;
        const { width, height } = this.dimensions;

        if (obj)
            obj[ this.id ] = this;

        for (let y = top; y < top + height; y++) {
            while (arr.length <= y)
                arr.push([]);

            for (let x = left; x < left + width; x++) {
                while (arr[ y ].length < x)
                    arr[ y ].push(null);

                const val = arr[ y ][ x ];

                if (!val) {
                    arr[ y ][ x ] = this.id;
                    continue;
                }

                arr[ y ][ x ] = 'X';

                if (!obj)
                    continue;

                this.overlaps = true;

                if (val !== 'X')
                    obj[ val ].overlaps = true;
            }
        }
    }
}

export class Day3 {
    #data = '';
    #grid = [];
    #obj = {};

    constructor() {
        new Solution().bindTo(this);
    }

    get DAY() {
        return this.constructor.DAY;
    }

    static get DAY() {
        return 3;
    }

    part1(data = this.#data) {
        this.#grid = [];
        return (
            Promise
                .resolve(data)
                .then(res => res.trim().split('\n'))
                .then(data => data.map(line => new Patch(line)))
                .then(data => data.forEach(patch => patch.draw(this.#grid)))
                .then(() => this.#grid.reduce((acc, line) => acc + line.filter(patch => patch === 'X').length, 0))
                .then(data => this._trigger('success', 1, data))
        );
    }

    part2(data = this.#data) {
        this.#grid = [];
        return (
            Promise
                .resolve(data)
                .then(res => res.trim().split('\n'))
                .then(data => data.map(line => new Patch(line)))
                .then(data => data.forEach(e => e.draw(this.#grid, this.#obj)))
                .then(() => Object.values(this.#obj).find(o => !o.overlaps).id)
                .then(data => this._trigger('success', 2, data))
        );
    }
}
