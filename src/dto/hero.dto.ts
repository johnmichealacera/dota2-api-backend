export interface HeroDTO {
  id: number;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  img: string;
  icon: string;
  base_health: number;
  base_str: number;
  base_agi: number;
  base_int: number;
  base_mana: number;
  base_armor: number;
  base_mr: number;
  attack_range: number;
  attack_rate: number;
  move_speed: number;
}

import { HERO_URL_BASE } from "../constants/constants.json";
export class Hero {
  public id: number;
  public name: string;
  public primaryAttr: string;
  public attackType: string;
  public roles: string[];
  public img: string;
  public icon: string;
  public health: number;
  public baseStr: number;
  public baseAgi: number;
  public baseInt: number;
  public baseMana: number;
  public baseArmor: number;
  public baseMr: number;
  public attackRange: number;
  public attackRate: number;
  public moveSpeed: number;
  public hoverFirst: number;
  public hoverSecond: number;
  public hoverThird: number;

  constructor(data: HeroDTO) {
    this.id = data.id;
    this.name = data.localized_name;
    this.primaryAttr = data.primary_attr;
    this.attackType = data.attack_type;
    this.roles = data.roles;
    this.img = `${HERO_URL_BASE}/${data.img.substring(data.img.lastIndexOf('/') + 1)}`;
    this.icon = `${HERO_URL_BASE}/${data.img.substring(data.img.lastIndexOf('/') + 1)}`
    this.health = data.base_health;
    this.baseStr = data.base_str;
    this.baseAgi = data.base_agi;
    this.baseInt = data.base_int;
    this.baseMana = data.base_mana;
    this.baseArmor = data.base_armor;
    this.baseMr = data.base_mr;
    this.attackRange = data.attack_range;
    this.attackRate = data.attack_rate;
    this.moveSpeed = data.move_speed;
    this.hoverFirst = data.base_str;
    this.hoverSecond = data.base_agi;
    this.hoverThird = data.base_int;
  }
}
