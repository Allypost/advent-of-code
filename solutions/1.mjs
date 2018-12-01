import { Solution } from './solution';

export class Day1 {
    DAY = 1;
    #data = '';

    constructor() {
        new Solution().bindTo(this);
    }

    part1(data = this.#data) {
        return (
            Promise
                .resolve(data)
                .then(res => res.trim().split('\n').map(Number))
                .then(data => data.reduce((acc, a) => acc + a, 0))
                .then(data => this._trigger('success', 1, data))
        );
    }

    part2(data = this.#data) {
        return (
            Promise
                .resolve(data)
                .then(res => res.trim().split('\n').map(Number))
                .then(data => {
                    const seen = new Set([]);
                    let i = 0;
                    let num = data[ 0 ];
                    while (!seen.has(num)) {
                        this._trigger('progress', 2, num);

                        seen.add(num);
                        i = (i + 1) % data.length;
                        num += data[ i ];
                    }

                    return num;
                })
                .then(data => this._trigger('success', 2, data))
        );
    }
}
