import  mocha  from 'mocha'
import  fs from 'fs'
import  path from 'path';

// Instantiate a Mocha instance.
// var mocha = new Mocha();

var testDir = __dirname

console.log("testdir=="+testDir);


// // Add each .js file to the mocha instance
// fs.readdirSync(testDir).filter(function(file) {
//     // Only keep the .js files
//     return file.substr(-3) === '.js';

// }).forEach(function(file) {
//     mocha.addFile(
//         path.join(testDir, file)
//     );
// });

// // Run the tests.
// mocha.run(function(failures) {
//   process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
// });


export default {

	testdir:"__dirname",
	mocha:mocha

}