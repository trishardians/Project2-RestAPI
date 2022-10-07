module.exports = (sequelize, Sequelize) => {
	const News = sequelize.define("news", {
		urlGambar: {
			type: Sequelize.STRING
		},
		judulBerita: {
			type: Sequelize.STRING
		},
		isiBerita1: {
			type: Sequelize.TEXT,
		},
		isiBerita2: {
			type: Sequelize.TEXT
		},
		isiBerita3: {
			type: Sequelize.TEXT
		}
	}, {
		paranoid: true
	});

	return News;
};