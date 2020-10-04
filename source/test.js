const { TIMEOUT } = require('dns');
var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

// Instantiate a Mocha instance.
var mocha = new Mocha();

const readline = require('readline');

var testDir = './test'
//change timeout
mocha.timeout(5000);

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function(file) {
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach(function(file) {
    mocha.addFile(
        path.join(testDir, file)
    );
});

// Run the tests.
mocha.run(function(failures) {
  process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
});


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  console.log("PRESS ENTER TO EXIT");
  rl.question("", (answer) => {
  
    rl.close();
  });