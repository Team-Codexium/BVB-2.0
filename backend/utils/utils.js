import { Battle } from '../models/battle.model.js';
import cron from 'node-cron'

async function checkAndCompleteExpiredBattles() {
  const now = new Date();
  const activeBattles = await Battle.find({ status: 'active' });
  for (const battle of activeBattles) {
    const start = battle.battleDate || battle.createdAt;
    const expiry = new Date(start.getTime() + battle.timeLimit * 60000);
    if (now > expiry) {
      // Determine winner
      const v1 = battle.voting.rapper1Votes;
      const v2 = battle.voting.rapper2Votes;
      let winner = null;
      if (v1 > v2) winner = battle.contestants.rapper1;
      else if (v2 > v1) winner = battle.contestants.rapper2;
      // else: tie logic

      battle.status = 'completed';
      battle.winner = winner;
      battle.endTime = expiry;
      await battle.save();
    }
  }
}

cron.schedule('*/1 * * * *', checkAndCompleteExpiredBattles);