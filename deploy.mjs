import Arweave from "arweave";
import assert from "assert";
import fs from "fs";

const walletFile = process.argv[2];

console.log("Wallet file:", walletFile);

const pkg = JSON.parse(fs.readFileSync("./package.json"));

assert(walletFile, "Wallet required!");
const jwk = JSON.parse(fs.readFileSync(walletFile).toString());

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

const data = fs.readFileSync("./dist/main.js");

var txJS;
arweave.createTransaction({ data }, jwk)
.then((tx) => {
  tx.addTag('Content-Type', 'application/javascript');
  txJS = tx;
  return arweave.transactions.sign(txJS, jwk);
})
.then(() => arweave.transactions.post(txJS))
.then((result) => {
  if ( result.status != 200 ) throw result.statusText;
  console.log(`Result JS: ${JSON.stringify(result)}`);
  console.log(`JS txid: ${txJS.id}`);
  fs.readFile("./dist/index.html", 'utf8', function(err, data){
    if (err) throw err;
    data = data.replace('./main.js', `https://arweave.net/${txJS.id}`);
    deployHtml(data, jwk);
  });
})
.catch((error) => {
  console.error(error);
});

function deployHtml(data, jwk) {
  var txHtml;

  arweave.createTransaction({ data }, jwk)
  .then((tx) => {
    tx.addTag('Content-Type', 'text/html');
    txHtml = tx;
    return arweave.transactions.sign(txHtml, jwk);
  })
  .then(() => arweave.transactions.post(txHtml))
  .then((result) => {
    if ( result.status != 200 ) throw result.statusText;
    console.log(`Result HTML: ${JSON.stringify(result)}`);
    console.log(`HTML txid: ${txHtml.id}`);
  })
}
