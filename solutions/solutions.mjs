import { Day1 } from './1';
import { Day2 } from './2';
import { Day3 } from './3';
import { Day4 } from './4';

Array.prototype.flat = Array.prototype.flat || function(depth) {
    return (
        this.reduce(
            (acc, el) => (
                [
                    ...acc,
                    ...(
                        Array.isArray(el) && depth > 0
                        ? el.flat(depth - 1)
                        : [ el ]
                    ),

                ]
            ),
            [],
        )
    );
};

Array.prototype.flatMap = Array.prototype.flatMap || function(...args) {
    return this.map(...args).flat(1);
};

const allDays = [ Day1, Day2, Day3, Day4 ];

const args =
    process.argv
           .slice(2)
           .flatMap(arg => arg.split(','))
           .map(Number)
           .filter(arg => Number.isInteger(arg));

const days =
    allDays
        .filter(day => args.includes(day.DAY))
        .sort((a, b) => a.DAY - b.DAY);

export default args.length ? days : allDays;
