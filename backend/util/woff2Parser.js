const fs = require('fs');
const _woff2Parser = require('woff2-parser');


const woff2Parser = (req, res, next) => {
	return new Promise((resolve,reject)=>{
		fs.readFile('font.woff2', function (err, contents) {
			if (err) throw err;
			_woff2Parser(contents).then(function (result) {
				console.log(result);
				resolve()
			}).catch(error => {
				reject()
			})
		});
	})

};


exports.default = woff2Parser;
