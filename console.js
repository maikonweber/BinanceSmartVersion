module.exports =  (colors, args) => {
    const obj = {
        'red': '\x1b[31m',
        'green': '\x1b[32m',
        'yellow': '\x1b[33m',
        'blue': '\x1b[34m',
        'magenta': '\x1b[35m',
        'cyan': '\x1b[36m',
        'white' : '\x1b[37m',
        'c1' : '\x1b[90m',
        'c2' : '\x1b[90m',
        'c3' : '\x1b[92m',
        'c4' : '\x1b[93m',
        'c5' : '\x1b[94m'
    }

    const color = obj[colors] || '\x1b[37m'
    const reset = '\x1b[0m'
    const message = args.join(' ')
    console.log(color + message + reset)
}
