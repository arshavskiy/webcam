function ws(params) {

    // const WebSocket = require('ws');
    // const ws = new WebSocket('ws://localhost:8080');
    // const wss = new WebSocket.Server({
    //   port: 8080,
    //   perMessageDeflate: {
    //     zlibDeflateOptions: {
    //       // See zlib defaults.
    //       chunkSize: 1024,
    //       memLevel: 7,
    //       level: 3
    //     },
    //     zlibInflateOptions: {
    //       chunkSize: 10 * 1024
    //     },
    //     // Other options settable:
    //     clientNoContextTakeover: true, // Defaults to negotiated value.
    //     serverNoContextTakeover: true, // Defaults to negotiated value.
    //     serverMaxWindowBits: 10, // Defaults to negotiated value.
    //     // Below options specified as default values.
    //     concurrencyLimit: 10, // Limits zlib concurrency for perf.
    //     threshold: 1024 // Size (in bytes) below which messages
    //     // should not be compressed.
    //   }
    // });




    // const BinaryServer = require('binaryjs').BinaryServer;

    // const now = new Date(Date.now());
    // const date = now.getDate() + '.' + now.getMonth() + '__' + Date.now();
    // let outFile = 'public/records/' + date + '.wav';

    // BinaryServer({
    //   port: 9001
    // }).on('connection', function (client) {
    //   console.log('1. new connection');

    //   let fileWriter = new wav.FileWriter(outFile, {
    //     channels: 1,
    //     sampleRate: 48000,
    //     bitDepth: 16
    //   });

    //   client.on('stream', function (stream, meta) {
    //     console.log('2. new stream');
    //     stream.pipe(fileWriter);

    //     stream.on('end', function () {
    //       console.log('3 end stream');
    //       fileWriter.end();

    //       console.log('4 wrote to file ' + outFile);
    //     });
    //   });
    // });

}

module.exports = {};