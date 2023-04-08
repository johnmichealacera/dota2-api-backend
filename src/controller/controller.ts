import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { Hero } from '../dto/hero.dto';
import { getRedis, setRedis } from "../cache/redis";
import { Team } from "../dto/team.dto";


export const getDotaHeroes = async (req: Request, res: Response, next: NextFunction) => {
  const redisData = await getRedis('dotaHeroes');
  if (redisData) {
    return res.status(200).json(redisData);
  }
  const { query }: any = req;
  const pageSize = query?.pageSize ?? 10;
  const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
  const { data } = await axios.get(`${openDotaApiUrl}/constants/heroes`);
  const heroes = Object.values(data).map((hero: any) => {
    return new Hero(hero);
  });
  await setRedis('dotaHeroes', heroes);

  return res.status(200).json(heroes);
}

export const getHeroInfoById = async (req: Request, res: Response, next: NextFunction) => {
  const { params }: any = req;
  const id = parseInt(params?.id, 10);
  const redisData = await getRedis(`dotaInfoHero-${id}`);
  if (redisData) {
    return res.status(200).json(redisData);
  }
  const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
  const { data } = await axios.get(`${openDotaApiUrl}/constants/heroes`);
  const hero: any = Object.values(data).find((hero: any) => {
    return hero?.id === id;
  });
  await setRedis(`dotaInfoHero-${id}`, new Hero(hero));

  return res.status(200).json(new Hero(hero));
}

export const getHeroMatchupById = async (req: Request, res: Response, next: NextFunction) => {
  const { params }: any = req;
  const id = parseInt(params?.id, 10);
  const redisData = await getRedis(`dotaHeroMatchup-${id}`);
  if (redisData) {
    return res.status(200).json(redisData);
  }
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
  )).sort((a: any, b: any) => b.winRate - a.winRate);
  await setRedis(`dotaHeroMatchup-${id}`, dotaHeroMatchups)

  return res.status(200).json(dotaHeroMatchups);
}

export const getProplayers = async (req: Request, res: Response, next: NextFunction) => {
  const redisData = await getRedis('proPlayers');
  if (redisData) {
    return res.status(200).json(redisData);
  }
  
  const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
  const { data } = await axios.get(`${openDotaApiUrl}/proPlayers`);
  await setRedis('proPlayers', data)

  return res.status(200).json(data);
}

export const getProTeams = async (req: Request, res: Response, next: NextFunction) => {
  const redisData = await getRedis('proTeams');
  if (redisData) {
    return res.status(200).json(redisData);
  }
  const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
  const { data } = await axios.get(`${openDotaApiUrl}/teams`);
  const teamData = data?.map((item: any) => ({
    ...item,
    hoverFirst: item?.rating,
    hoverSecond: item?.wins,
    hoverThird: item?.losses,
    id: item?.team_id,
    img: item?.logo_url,
  }))
  await setRedis('proTeams', teamData)
  return res.status(200).json(teamData);
}

const groupBy = (objectArray: any, property: any) => {
  return objectArray.reduce((accumulator: any, currentObject: any) => {
    let key = currentObject[property];
    if (!accumulator[key]) {
      accumulator[key] = {
        id: 0,
        wins: 0,
        gamesPlayed: 0,
        winRate: 0,
        name: '',
        img: '',
        leagueName: '',
      };
    }
    accumulator[key].id = currentObject.opposing_team_id;
    accumulator[key].wins = currentObject.radiant === currentObject.radiant_win ? accumulator[key].wins + 1 : accumulator[key].wins;
    accumulator[key].gamesPlayed += 1;
    accumulator[key].winRate = accumulator[key].wins/accumulator[key].gamesPlayed * 100;
    accumulator[key].name = currentObject.opposing_team_name;
    accumulator[key].img = currentObject.opposing_team_logo;
    accumulator[key].leagueName = currentObject.league_name;
    return accumulator;
  }, {});
}

export const getTeamMatchupByTeamId = async (req: Request, res: Response, next: NextFunction) => {
  const { params }: any = req;
  const id = parseInt(params?.id, 10);
  const redisData = await getRedis(`dotaTeamMatchup-${id}`);
  if (redisData) {
    return res.status(200).json(redisData);
  }
  const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
  const { data } = await axios.get(`${openDotaApiUrl}/teams/${id}/matches`);
  const teamMatchup = Object.values(groupBy(data, 'opposing_team_id'));
  await setRedis(`dotaTeamMatchup-${id}`, teamMatchup);
  return res.status(200).json(teamMatchup);
}

export const getTeamInfoByTeamId = async (req: Request, res: Response, next: NextFunction) => {
  const { params }: any = req;
  const id = parseInt(params?.id, 10);
  const redisData = await getRedis(`dotaInfoTeam-${id}`);
  if (redisData) {
    return res.status(200).json(redisData);
  }
  const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
  const { data } = await axios.get(`${openDotaApiUrl}/teams/${id}`);
  await setRedis(`dotaInfoTeam-${id}`, new Team(data));
  return res.status(200).json(new Team(data));
}