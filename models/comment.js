module.exports = (sequelize, Sequelize) => {
	const Comment = sequelize.define("comments", {
		newsid: {
			type: Sequelize.INTEGER
		},
		comment: {
			type: Sequelize.TEXT
		}
	}, {
		paranoid: true
	});

	return Comment;
};