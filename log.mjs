export default class Log {
    static result(text) {
        console.log(`\u001b[0K\u001b[1m\u001b[32m${ text }\u001b[0m`);
    }

    static progress(text) {
        process.stdout.write(`\u001b[0K\u001b[33m${ text }\u001b[0m`);
        process.stdout.moveCursor(-String(text).length);
    }
}
