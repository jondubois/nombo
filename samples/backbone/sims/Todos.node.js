module.exports.read = function (req, res) {
	var todos = [
		{
			done: false,
			id: "84bdd3b2-4702-2967-42fc-c9a9c4948366",
			order: 1,
			title: "Remember the milk"
		},
		{
			done: false,
			id: "84bdd3b2-4702-2967-42fc-c9a9c4948367",
			order: 2,
			title: "Doctor appointment at 5:30pm"
		}
	]
	res.end(todos);
}

module.exports.create = function (req, res) {
	
}

module.exports.update = function (req, res) {
	
}

module.exports.delete = function (req, res) {
	
}