import { Solution } from './solution';

export class Day5 {
    #data = '';

    constructor() {
        new Solution().bindTo(this);
    }

    get DAY() {
        return this.constructor.DAY;
    }

    static get DAY() {
        return 5;
    }

    trimChars(chars) {
        let i = 0;
        while (i < chars.length - 1) {
            const delta = Math.abs(chars[ i ].charCodeAt(0) - chars[ i + 1 ].charCodeAt(0));

            if (delta === 32)
                chars.splice(i, 2);
            else
                i++;
        }

        return chars;
    }

    reduce(chars, trigger = false) {
        let newChars = chars.split('');
        let oldChars = [];

        while (newChars.length !== oldChars.length) {
            if (trigger)
                this._trigger('progress', 1, newChars.length);

            oldChars = newChars.slice();
            newChars = this.trimChars(newChars);
        }

        return newChars.join('');
    }

    uniquePolymers(chars) {
        const map = new Map();
        const charList = chars.split('');

        for (const char of charList)
            map.set(char.toLowerCase(), 1);

        return Array.from(map.keys());
    }

    part1(data = this.#data) {
        return (
            Promise
                .resolve(data)
                .then(res => res.trim())
                .then(data => this.reduce(data, true))
                .then(data => data.length)
                .then(data => this._trigger('success', 1, data))
        );
    }

    part2(data = this.#data) {
        return (
            Promise
                .resolve(data)
                .then(res => res.trim())
                .then(data => {
                    const uniquePolymers = this.uniquePolymers(data);

                    let minReducedLength = Infinity;
                    let maxReducedLength = -Infinity;

                    for (const polymer of uniquePolymers) {
                        const dataWithoutPolymer =
                            data.split('')
                                .filter((p) => polymer !== p.toLowerCase())
                                .join('');

                        const reducedLength = this.reduce(dataWithoutPolymer).length;

                        minReducedLength = Math.min(minReducedLength, reducedLength);
                        maxReducedLength = Math.max(maxReducedLength, reducedLength);

                        const lengthString = String(minReducedLength).padStart(String(maxReducedLength).length);
                        const indexString = String(uniquePolymers.indexOf(polymer)).padEnd(String(uniquePolymers.length).length, '0');

                        this._trigger('progress', 2, `${ lengthString } [${ indexString }/${ uniquePolymers.length }]`);
                    }

                    return minReducedLength;
                })
                .then(data => this._trigger('success', 2, data))
        );
    }
}
