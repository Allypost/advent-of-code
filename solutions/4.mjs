import luxon        from 'luxon';
import { Solution } from './solution';

const { DateTime } = luxon;

function chunk(array, chunkLength) {
    return (
        array
            .map(
                (_, i, all) =>
                    all.slice(chunkLength * i, chunkLength * (i + 1)),
            )
            .filter(x => x.length)
    );
}

class Day {
    date = null;
    events = [];
    #guard = null;

    constructor(date) {
        this.date = date;
    }

    get guard() {
        return this.#guard;
    }

    set guard(guard) {
        this.#guard = guard;
        guard.addDay(this);
    }

    get sleepSchedule() {
        const date = new Array(60).fill(0);
        const chunked = chunk(this.events, 2);

        for (const [ sleep, awake ] of chunked)
            for (let i = sleep.time; i < awake.time; i++)
                date[ i ]++;

        return date;
    }

    get sleptFor() {
        return this.sleepSchedule.reduce((acc, v) => acc + v, 0);
    }

    addEvent(event) {
        this.events = [ ...this.events, event ].sort((a, b) => a.time - b.time);
    }

    static simplifyAction(action) {
        switch (action) {
            case 'wakes up':
                return 'waken';
            case 'falls asleep':
                return 'sleep';
            default:
                return Day.getGuardID(action);
        }
    }

    static getGuardID(action) {
        const guardRegex = /Guard\s#(\d+)\sbegins\sshift/i;

        const [ , id ] = guardRegex.exec(action) || [];

        return Number(id);
    }

    static standardizeDate(dateTime) {
        const date = DateTime.fromISO(dateTime.replace(' ', 'T'));

        if (date.hour === 0)
            return date;

        const untilEndOfDay = date.endOf('day').plus({ milliseconds: 1 }).diff(date);

        return date.plus(untilEndOfDay);
    }

    static parseLine(line) {
        const lineRegex = /\[(\d+-\d+-\d+ \d+:\d+)] (.*)/i;
        const [ , dateTime, action ] = lineRegex.exec(line) || [];

        const date = Day.standardizeDate(dateTime);
        const parsedAction = Day.simplifyAction(action);
        const isGuardLine = Number.isInteger(parsedAction);

        return {
            isGuardLine,
            date: date.toISODate(),
            time: isGuardLine ? 0 : date.minute,
            action: parsedAction,
        };
    }

}

class Guard {
    id = 0;
    #days = [];
    #dates = [];

    constructor(id) {
        this.id = id;
    }

    get events() {
        return this.#days.map(day => day.events).flat();
    }

    get sleptFor() {
        return this.sleepTimes.reduce((acc, a) => acc + a, 0);
    }

    get sleepTimes() {
        const sleepTimes = new Array(60).fill(0);
        const chunks = chunk(this.events, 2);

        for (const chunk of chunks) {
            const [ sleep, awake ] = chunk;

            for (let i = sleep.time; i < awake.time; i++)
                sleepTimes[ i ]++;
        }

        return sleepTimes.map(v => v / 2);
    }

    get favouriteSleepTime() {
        const { sleepTimes } = this;

        return sleepTimes.indexOf(Math.max(...sleepTimes));
    }

    hadDutyOn(date) {
        return this.#dates.includes(date);
    }

    addDay(day) {
        this.#days.push(day);
    }

    addDate(date) {
        this.#dates.push(date);
    }

}

export class Day4 {
    #data = '';
    #days = {};
    #guards = {};

    constructor() {
        new Solution().bindTo(this);
    }

    get DAY() {
        return this.constructor.DAY;
    }

    static get DAY() {
        return 4;
    }

    part1(data = this.#data) {
        this.#days = {};

        return (
            Promise
                .resolve(data)
                .then(res => res.trim().split('\n'))
                .then(data => data.sort())
                .then(data => data.map(Day.parseLine))
                .then(data => data.filter((event => {
                    const { isGuardLine, date, action: id } = event;

                    if (!isGuardLine)
                        return true;

                    if (!this.#guards[ id ])
                        this.#guards[ id ] = new Guard(id);

                    this.#guards[ id ].addDate(date);

                    return false;
                })))
                .then(data => data.forEach(event => {
                    const { date, time, action } = event;

                    if (!this.#days[ date ])
                        this.#days[ date ] = new Day(date);

                    if (!this.#days[ date ].guard)
                        this.#days[ date ].guard = Object.values(this.#guards).find(guard => guard.hadDutyOn(date));

                    this.#days[ date ].addEvent({ time, action });
                }))
                .then(() => {
                    const laziest = Object.values(this.#guards).sort((a, b) => a.sleptFor - b.sleptFor).pop();
                    const { favouriteSleepTime } = laziest;

                    return laziest.id * favouriteSleepTime;
                })
                .then(data => this._trigger('success', 1, data))
        );
    }

    part2(data = this.#data) {
        this.#days = {};

        return (
            Promise
                .resolve(data)
                .then(res => res.trim().split('\n'))
                .then(data => data.sort())
                .then(data => data.map(Day.parseLine))
                .then(data => data.filter((event => {
                    const { isGuardLine, date, action: id } = event;

                    if (!isGuardLine)
                        return true;

                    if (!this.#guards[ id ])
                        this.#guards[ id ] = new Guard(id);

                    this.#guards[ id ].addDate(date);

                    return false;
                })))
                .then(data => data.forEach(event => {
                    const { date, time, action } = event;

                    if (!this.#days[ date ])
                        this.#days[ date ] = new Day(date);

                    if (!this.#days[ date ].guard)
                        this.#days[ date ].guard = Object.values(this.#guards).find(guard => guard.hadDutyOn(date));

                    this.#days[ date ].addEvent({ time, action });
                }))
                .then(() => {
                    return (
                        Object
                            .values(this.#guards)
                            .map(({ id, favouriteSleepTime, sleepTimes }) => [ sleepTimes[ favouriteSleepTime ], id * favouriteSleepTime ])
                            .sort(([ a ], [ b ]) => a - b)
                            .pop()
                            .pop()
                    );
                })
                .then(data => this._trigger('success', 2, data))
        );
    }
}
