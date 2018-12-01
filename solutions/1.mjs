export class Day1 {
    DAY = 1;
    #on = {};
    #data = '';

    on(event, cb = () => 0) {
        if (!this.#on[ event ])
            this.#on[ event ] = [];

        this.#on[ event ].push(cb);
    }

    _trigger(event, part, data) {
        if (this.#on[ event ])
            this.#on[ event ].forEach(e => e(part, data));

        return data;
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
                    const seen = [];
                    let i = 0;
                    let num = data[ 0 ];
                    while (!seen.includes(num)) {
                        this._trigger('progress', 2, num);

                        seen.push(num);
                        i = (i + 1) % data.length;
                        num += data[ i ];
                    }

                    return num;
                })
                .then(data => this._trigger('success', 2, data))
        );
    }
}
