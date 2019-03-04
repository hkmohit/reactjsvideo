var fs = require('fs');

module.exports.getVideos = async (req, res, next) => {
	var files = await fs.readdirSync(__dirname);
	// console.log("files", files);
};

module.exports.getVideosFromDirectory = () => {
	return new Promise((resolve, reject) => {
		try {
			let dir = "./data/activeVideoes";
			let path = `${process.env.EXPRESS_SCHEME}${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}/data/activeVideoes/`;
			var contents = fs.readdirSync(dir);
			let files = [];
			let counter = -1;

			var getFiles = () => {
				counter++;
				if (contents[counter]) {
					let file = contents[counter];
					var stat = fs.statSync(dir + '/' + file);
					if (stat && stat.isFile()) {
						file = path + file;
						files.push({ file, name: `Video${Math.random()}` });
					}
					getFiles();
				}
			};
			getFiles();
			resolve({ error: false, data: files });
			return;
		} catch (_catch) {
			// console.log("getVideosFromDirectory -> _catch", _catch);
			resolve({ error: true, data: _catch, message: _catch.message });
			return;
		}
	});
};