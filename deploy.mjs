import Arweave from "arweave";
import assert from "assert";
import fs from "fs";

const walletFile = process.argv[2];

if (!walletFile) {
  console.log("Oops, you must pass a wallet file for this command to work.\nUsage: npm run deploy <your-wallet-keyfile.json>");
  process.exit()
}
else
  console.log("Wallet found:", walletFile);

const jwk = JSON.parse(fs.readFileSync(walletFile).toString());

const arConfig = {
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
};

const arweave = Arweave.init(arConfig);

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
    data = data.replace('./main.js', `${arConfig.protocol}://${arConfig.host}/${txJS.id}`);
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

    console.log(`\nYour hyperapp is ready! Visit ${arConfig.protocol}://${arConfig.host}/${txHtml.id}`)
  })
}
