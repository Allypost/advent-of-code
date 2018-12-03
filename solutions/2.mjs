import { Solution } from './solution';

export class Day2 {
    #data = '';

    constructor() {
        new Solution().bindTo(this);
    }

    get DAY() {
        return this.constructor.DAY;
    }

    static get DAY() {
        return 2;
    }

    getDifference(a, b) {
        a = a.split('');
        b = b.split('');
        return a
            .map((c, i) => b[ i ] !== c ? c : '')
            .filter(c => c.length)
            .join('');
    }

    getSame(a, b) {
        a = a.split('');
        b = b.split('');
        return a
            .map((c, i) => b[ i ] === c ? c : '')
            .filter(c => c.length)
            .join('');
    }

    part1(data = this.#data) {
        return (
            Promise
                .resolve(data)
                .then(data => data.split('\n'))
                .then(
                    data => data.map(
                        line =>
                            line
                                .split('')
                                .reduce(
                                    (acc, char) => (
                                        Object.assign(
                                            acc,
                                            {
                                                [ char ]: (acc[ char ] || 0) + 1,
                                            },
                                        )
                                    ),
                                    {},
                                ),
                    ),
                )
                .then(
                    data => data.map(
                        line =>
                            Object
                                .values(line)
                                .filter(v => v === 3 || v === 2),
                    ),
                )
                .then(
                    data => data.map(
                        line => [
                            line.find(v => v === 2) !== undefined,
                            line.find(v => v === 3) !== undefined,
                        ],
                    ),
                )
                .then(
                    data => data.reduce(
                        (acc, [ hasTwos, hasThrees ]) => [
                            acc[ 0 ] + Number(hasTwos),
                            acc[ 1 ] + Number(hasThrees),
                        ],
                        [ 0, 0 ],
                    ),
                )
                .then(([ twos, threes ]) => twos * threes)
                .then((data) => this._trigger('success', 1, data))
        );
    }

    part2(data = this.#data) {
        return (
            Promise
                .resolve(data)
                .then(data => data.split('\n'))
                .then(
                    data => data.map(
                        line => data.find(
                            otherLine => this.getDifference(line, otherLine).length === 1,
                        ),
                    ),
                )
                .then(data => data.filter(d => d))
                .then(data => this.getSame(data.pop(), data.pop()))
                .then((data) => this._trigger('success', 2, data))
        );
    }
}
