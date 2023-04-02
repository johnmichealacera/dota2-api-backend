import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { Hero, HeroDTO } from '../dto/hero.dto';

export const getDotaHeroes = async (req: Request, res: Response, next: NextFunction) => {
  const { query }: any = req;
  const pageSize = query?.pageSize ?? 10;
  const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
  const { data } = await axios.get(`${openDotaApiUrl}/constants/heroes`);

  const heroes = Object.values(data).map((hero: any) => {
    return new Hero(hero);
  });

  return res.status(200).json(heroes);
}

export const getHeroInfoById = async (req: Request, res: Response, next: NextFunction) => {
  const { params }: any = req;
  const id = parseInt(params?.id, 10);
  const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
  const { data } = await axios.get(`${openDotaApiUrl}/constants/heroes`);
  const hero: any = Object.values(data).find((hero: any) => {
    return hero?.id === id;
  });

  return res.status(200).json(new Hero(hero));
}

export const getHeroMatchupById = async (req: Request, res: Response, next: NextFunction) => {
  const { params }: any = req;
  const id = parseInt(params?.id, 10);
  const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
  const dotaHeroMatchupsRaw = await axios.get(`${openDotaApiUrl}/heroes/${id}/matchups`);
  const { data } = await axios.get(`${openDotaApiUrl}/constants/heroes`);
  const heroes = Object.values(data).map((hero: any) => {
    return new Hero(hero);
  });
  const dotaHeroMatchups = dotaHeroMatchupsRaw?.data.map((dotaHeroMatchupRaw: any) => (
    {
      id: dotaHeroMatchupRaw?.hero_id,
      name: heroes?.find((hero) => (hero.id === dotaHeroMatchupRaw?.hero_id))?.name,
      img: heroes?.find((hero) => (hero.id === dotaHeroMatchupRaw?.hero_id))?.img,
      wins: dotaHeroMatchupRaw?.wins,
      gamesPlayed: dotaHeroMatchupRaw?.games_played,
      winRate: dotaHeroMatchupRaw?.wins/dotaHeroMatchupRaw?.games_played * 100,
    }
  ))

  return res.status(200).json(dotaHeroMatchups.sort((a: any, b: any) => b.winRate - a.winRate));
}