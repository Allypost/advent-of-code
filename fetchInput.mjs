import fs    from 'fs';
import Fetch from 'node-fetch';
import Log   from './log';

export const fetch = (day, withLog = true) => {
    if (withLog)
        Log.progress(`Fetching...`);

    return (
        Fetch(`https://adventofcode.com/2018/day/${ day }/input`, { headers: { cookie: fs.readFileSync('cookie.txt', 'utf-8').trim() } })
            .then(res => res.text())
            .then(res => res.trim())
            .then((res) => {
                if (withLog)
                    Log.result(`Fetched`);

                return res;
            })
    );
};
