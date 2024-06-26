import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { Hero, HeroDTO } from '../dto/hero.dto';
import { getRedis, setRedis } from "../cache/redis";
import { Team } from "../dto/team.dto";
import { HERO_URL_BASE } from "../constants/constants.json";
import { ItemsPaginated } from "../dto/item-paginated.dto";

const logAndReturnError = (error: any, res: Response) => {
  if (error.response) {
    console.error('Error status:', error.response.status);
    console.error('Error data:', error.response.data);
    return res.status(500).json({ error: 'Error occurred' });
  } else if (error.request) {
    console.error('Request made but no response received:', error.request);
    return res.status(500).json({ error: 'Error occurred' });
  } else {
    console.error('Error occurred:', error.message);
    return res.status(500).json({ error: 'Error occurred' });
  }
}

const paginateItems = (page: number, pageSize: number, rawData: Hero[]): ItemsPaginated => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = rawData.slice(startIndex, endIndex);
    const sliceData = {
      items: paginatedItems,
      pagination: {
          totalItems: rawData.length,
          currentPage: page,
          pageSize: pageSize,
          totalPages: Math.ceil(rawData.length / pageSize)
      }
  };
  return sliceData
}

export const getDotaHeroes = async (req: Request, res: Response, next: NextFunction): Promise<Response<ItemsPaginated> | Response<{ error: string }>> => {
  try {
    const page: number = parseInt(req?.query?.page as string, 10) || 1;
    const pageSize: number = parseInt(req?.query?.pageSize as string, 10) || 10;
    const redisData = await getRedis('dotaHeroes');
    if (redisData) {
      const paginatedHeroes = paginateItems(page, pageSize, redisData);
      return res.status(200).json(paginatedHeroes);
    }
    const rawHeroes = await fetchDotaHeroes();
    const heroes = Object.values(rawHeroes).map((hero: HeroDTO) => {
      return new Hero(hero);
    });
    await setRedis('dotaHeroes', heroes);
    const paginatedHeroes = paginateItems(page, pageSize, heroes);

    return res.status(200).json(paginatedHeroes);
  } catch (error: any) {
    return logAndReturnError(error, res);
  }
}

export const getHeroInfoById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { params }: any = req;
    const id = parseInt(params?.id, 10);
    const redisData = await getRedis(`dotaInfoHero-${id}`);
    if (redisData) {
      return res.status(200).json(redisData);
    }
    const rawHeroes = await fetchDotaHeroes();
    const hero: any = Object.values(rawHeroes).find((hero: any) => {
      return hero?.id === id;
    });
    await setRedis(`dotaInfoHero-${id}`, new Hero(hero));

    return res.status(200).json(new Hero(hero));
  } catch (error: any) {
    logAndReturnError(error, res);
  }
}

export const getHeroMatchupById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req?.params?.id, 10);
    const page: number = parseInt(req?.query?.page as string, 10) || 1;
    const pageSize: number = parseInt(req?.query?.pageSize as string, 10) || 10;
    const redisData = await getRedis(`dotaHeroMatchup-${id}`);
    if (redisData) {
      const paginatedHeroMatchups = paginateItems(page, pageSize, redisData);
      return res.status(200).json(paginatedHeroMatchups);
    }
    const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
    const dotaHeroMatchupsRaw = await axios.get(`${openDotaApiUrl}/heroes/${id}/matchups`);
    const data = await fetchDotaHeroes();
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
    const paginatedHeroMatchups = paginateItems(page, pageSize, dotaHeroMatchups);
    return res.status(200).json(paginatedHeroMatchups);
  } catch (error: any) {
    logAndReturnError(error, res);
  }
}

export const getProplayers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const redisData = await getRedis('proPlayers');
    if (redisData) {
      return res.status(200).json(redisData);
    }
    
    const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
    const { data } = await axios.get(`${openDotaApiUrl}/proPlayers`);
    await setRedis('proPlayers', data)

    return res.status(200).json(data);
  } catch (error: any) {
    logAndReturnError(error, res);
  }
}

export const getProTeams = async (req: Request, res: Response, next: NextFunction): Promise<Response<ItemsPaginated> | Response<{ error: string }>> => {
  try {
    const page: number = parseInt(req?.query?.page as string, 10) || 1;
    const pageSize: number = parseInt(req?.query?.pageSize as string, 10) || 10;
    const redisData = await getRedis('proTeams');
    if (redisData) {
      const paginatedHeroes = paginateItems(page, pageSize, redisData);
      return res.status(200).json(paginatedHeroes);
    }
    const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
    const data = await fetchDotaTeams();
    const teamData = data?.map((item: any) => ({
      ...item,
      hoverFirst: item?.rating,
      hoverSecond: item?.wins,
      hoverThird: item?.losses,
      id: item?.team_id,
      img: item?.logo_url,
    }));
    await setRedis('proTeams', teamData);
    const paginatedTeams = paginateItems(page, pageSize, teamData);
    return res.status(200).json(paginatedTeams);
  } catch (error: any) {
    return logAndReturnError(error, res);
  }
}

const groupBy = (objectArray: any, property: any) => {
  try {
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
  } catch (error) {
    console.error('Error status:', JSON.stringify(error));
  }
}

export const getTeamMatchupByTeamId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page: number = parseInt(req?.query?.page as string, 10) || 1;
    const pageSize: number = parseInt(req?.query?.pageSize as string, 10) || 10;
    const id = parseInt(req.params?.id, 10);
    const redisData = await getRedis(`dotaTeamMatchup-${id}`);
    if (redisData) {
      const paginatedTeamMatchups = paginateItems(page, pageSize, redisData);
      return res.status(200).json(paginatedTeamMatchups);
    }
    const openDotaApiUrl: any = process.env.OPEN_DOTA_API_URL;
    const { data } = await axios.get(`${openDotaApiUrl}/teams/${id}/matches`);
    const teamMatchup: any = Object.values(groupBy(data, 'opposing_team_id'));
    await setRedis(`dotaTeamMatchup-${id}`, teamMatchup);
    const paginatedTeamMatchups = paginateItems(page, pageSize, teamMatchup);
    return res.status(200).json(paginatedTeamMatchups);
  } catch (error: any) {
    logAndReturnError(error, res);
  }
}

export const getTeamInfoByTeamId = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error: any) {
    logAndReturnError(error, res);
  }
}

export const fetchDotaHeroes = async (): Promise<HeroDTO[]> => {
  const redisData = await getRedis('rawDotaHeroes');
    if (redisData) {
      redisData;
    }
  const { data } = await axios.get(`${process.env.OPEN_DOTA_API_URL}/constants/heroes`);
  const heroes: any = Object.values(data).map((hero) => {
    return hero;
  });
  await setRedis('rawDotaHeroes', heroes);
  return heroes;
}

export const fetchDotaTeams = async () => {
  const redisData = await getRedis('rawProTeams');
    if (redisData) {
      redisData;
    }
  const { data } = await axios.get(`${process.env.OPEN_DOTA_API_URL}/teams`);
  await setRedis('rawProTeams', data)
  return data;
}