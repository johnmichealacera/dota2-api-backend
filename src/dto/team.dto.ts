export interface TeamDTO {
  team_id: number;
  name: string;
  rating: number;
  wins: number;
  losses: number;
  last_match_time: string;
  tag: string;
  logo_url: string;
}

export class Team {
  public id: number;
  public name: string;
  public rating: number;
  public wins: number;
  public losses: number;
  public lastMatchTime: string;
  public tag: string;
  public img: string;

  constructor(data: TeamDTO) {
    this.id = data.team_id;
    this.name = data.name;
    this.rating = data.rating;
    this.wins = data.wins;
    this.losses = data.losses;
    this.lastMatchTime = data.last_match_time;
    this.tag = data.tag;
    this.img = data.logo_url;
  }
}
