const outFile = './static/libs.js'
const libs = [
    './node_modules/react/dist/react.min.js',
    './node_modules/react-dom/dist/react-dom.min.js',
    './node_modules/whatwg-fetch/fetch.js'
]

const fs = require('fs')
const result = libs.map(filename => fs.readFileSync(filename, 'utf-8')).join('\n')
fs.createWriteStream(outFile).write(result)
