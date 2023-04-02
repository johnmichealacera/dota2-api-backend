import express from 'express';
import { getDotaHeroes, getHeroInfoById, getHeroMatchupById } from "../controller/controller";

const router = express.Router();
router.get('/heroes', getDotaHeroes);
router.get('/hero/:id', getHeroInfoById);
router.get('/hero-matchup/:id', getHeroMatchupById);

export default router;