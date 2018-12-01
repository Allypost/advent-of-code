export class Solution {
    #on = [];
    #defaultFn = async () => 0;

    bindTo(parent) {
        parent.on = (...args) => this.on(...args);
        parent._trigger = (...args) => this._trigger(...args);
    }

    on(event, cb = this.#defaultFn()) {
        if (!this.#on[ event ])
            this.#on[ event ] = [];

        this.#on[ event ].push(cb);
    }

    _trigger(event, part, data) {
        if (this.#on[ event ])
            this.#on[ event ].forEach(e => e(part, data));

        return data;
    }
}
