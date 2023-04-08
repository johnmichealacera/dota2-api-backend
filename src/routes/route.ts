import express from 'express';
import { getDotaHeroes, getHeroInfoById, getHeroMatchupById, getProplayers, getProTeams, getTeamInfoByTeamId, getTeamMatchupByTeamId } from "../controller/controller";

const router = express.Router();
router.get('/heroes', getDotaHeroes);
router.get('/hero/:id', getHeroInfoById);
router.get('/hero-matchup/:id', getHeroMatchupById);
router.get('/pro-players', getProplayers);
router.get('/pro-teams', getProTeams);
router.get('/team-matchup/:id', getTeamMatchupByTeamId);
router.get('/team/:id', getTeamInfoByTeamId);

export default router;