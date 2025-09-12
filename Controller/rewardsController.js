const express = require('express');
const router = express.Router();
const rewardsModel = require('../Model/Rewards');
const pointsModel = require('../Model/Points');

// GET /rewards?userId=1
router.get('/rewards', (req, res) => {
	const userId = Number(req.query.userId);
	if (!userId) {
		return res.status(400).json({ error: 'userId is required' });
	}
	rewardsModel.listRewards(userId)
		.then(result => {
			res.status(200).json({ rewards: result.rows || [] });
		})
		.catch(err => {
			console.error('Error listing rewards:', err);
			res.status(500).json({ error: 'Failed to list rewards: ' + err.message });
		});
});

// POST /rewards
// { userId, title, minutes }
router.post('/rewards', (req, res) => {
	const { userId, title, minutes } = req.body;
	if (!userId || !title || minutes === undefined) {
		return res.status(400).json({ error: 'userId, title and minutes are required' });
	}
	const parsedUserId = Number(userId);
	const parsedMinutes = Math.max(0, Number(minutes));
	if (parsedMinutes <= 0) {
		return res.status(400).json({ error: 'minutes must be greater than 0' });
	}
	const rewardId = Math.floor(Date.now() / 1000);

	rewardsModel.createReward(parsedUserId, rewardId, String(title).trim(), parsedMinutes)
		.then(() => pointsModel.getUserPoints(parsedUserId))
		.then((result) => {
			const userPoints = result.rows[0];
			res.status(201).json({
				message: 'Reward created successfully',
				reward: { id: parsedUserId, rewardid: rewardId, title: String(title).trim(), rewardpoint: parsedMinutes },
				points: userPoints.points,
				rank: userPoints.rank
			});
		})
		.catch(err => {
			console.error('Error creating reward:', err);
			if (/Insufficient points/i.test(err.message)) {
				return res.status(400).json({ error: 'Insufficient points' });
			}
			res.status(500).json({ error: 'Failed to create reward: ' + err.message });
		});
});

// DELETE /rewards/:rewardId?userId=1&refund=true
router.delete('/rewards/:rewardId', (req, res) => {
	const rewardId = Number(req.params.rewardId);
	const userId = Number(req.query.userId);
	const refund = String(req.query.refund || '').toLowerCase() === 'true';
	if (!userId || !rewardId) {
		return res.status(400).json({ error: 'userId and rewardId are required' });
	}
	rewardsModel.deleteReward(userId, rewardId, { refund })
		.then(() => pointsModel.getUserPoints(userId))
		.then((result) => {
			const userPoints = result.rows[0] || { points: 0, rank: 'Bronze' };
			res.status(200).json({ message: 'Reward deleted', points: userPoints.points, rank: userPoints.rank, refund });
		})
		.catch(err => {
			console.error('Error deleting reward:', err);
			res.status(500).json({ error: 'Failed to delete reward: ' + err.message });
		});
});

module.exports = router;
