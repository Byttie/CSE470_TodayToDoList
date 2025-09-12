const client = require('./database');
const { calculateRank } = require('./Points');

function createReward(userId, rewardId, title, minutes) {
	// Creates a reward and deducts points equal to minutes in a single transaction
	// Also recalculates and stores rank
	return client.query('BEGIN')
		.then(() => client.query('SELECT points FROM points WHERE id = $1 FOR UPDATE', [userId]))
		.then(result => {
			if (result.rows.length === 0) {
				throw new Error('User points not initialized');
			}
			const currentPoints = Number(result.rows[0].points) || 0;
			if (currentPoints < minutes) {
				throw new Error('Insufficient points');
			}
			const newPoints = currentPoints - minutes;
			const newRank = calculateRank(newPoints);
			return client.query(
				'INSERT INTO rewards (id, rewardid, title, rewardpoint) VALUES ($1, $2, $3, $4)'
				, [userId, rewardId, title, minutes]
			).then(() =>
				client.query('UPDATE points SET points = $1, rank = $2 WHERE id = $3', [newPoints, newRank, userId])
			);
		})
		.then(() => client.query('COMMIT'))
		.catch(err => client.query('ROLLBACK').then(() => { throw err; }));
}

function listRewards(userId) {
	return client.query(
		'SELECT id, rewardid, title, rewardpoint FROM rewards WHERE id = $1 ORDER BY rewardid DESC',
		[userId]
	);
}

function deleteReward(userId, rewardId, options = { refund: false }) {
	const refund = Boolean(options && options.refund);
	return client.query('BEGIN')
		.then(() => client.query('SELECT rewardpoint FROM rewards WHERE id = $1 AND rewardid = $2 FOR UPDATE', [userId, rewardId]))
		.then(result => {
			const reward = result.rows[0];
			const minutes = reward ? Number(reward.rewardpoint) || 0 : 0;
			return client.query('DELETE FROM rewards WHERE id = $1 AND rewardid = $2', [userId, rewardId])
				.then(() => {
					if (!refund || minutes <= 0) {
						return;
					}
					return client.query('SELECT points FROM points WHERE id = $1 FOR UPDATE', [userId]).then(pres => {
						if (pres.rows.length === 0) return;
						const currentPoints = Number(pres.rows[0].points) || 0;
						const newPoints = currentPoints + minutes;
						const newRank = calculateRank(newPoints);
						return client.query('UPDATE points SET points = $1, rank = $2 WHERE id = $3', [newPoints, newRank, userId]);
					});
				});
		})
		.then(() => client.query('COMMIT'))
		.catch(err => client.query('ROLLBACK').then(() => { throw err; }));
}

module.exports = { createReward, listRewards, deleteReward };
