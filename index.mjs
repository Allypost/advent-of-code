import { fetch } from './fetchInput';
import Log       from './log';
import days      from './solutions/solutions';

console.log();
console.log('      Advent of Code 2018       ');
console.log(' https://adventofcode.com/2018  ');
console.log(' Author: Josip "Allypost" Igrec ');
console.log();

const promiseDays =
    days
        .map(async Day => {
            const day = new Day();

            process.stdout.write(`Day ${ day.DAY }: `);
            const data = await fetch(day.DAY);

            day.on('progress', (part, data) => Log.progress(data));

            process.stdout.write('\tPart 1: ');
            Log.result(await day.part1(data));
            process.stdout.write('\tPart 2: ');
            Log.result(await day.part2(data));

            return true;
        });

(async () => {
    for (const day of promiseDays)
        await day;

    console.log('Done!')
})();
