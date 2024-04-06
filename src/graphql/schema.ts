export const typeDefs = `#graphql
  type Heroes {
    id: Int,
    localized_name: String,
    primary_attr: String,
    attack_type: String,
    roles: [String],
    img: String,
    icon: String,
    base_health: Int,
    base_str: Int,
    base_agi: Int,
    base_int: Int,
    base_mana: Int,
    base_armor: Int,
    base_mr: Int,
    attack_range: Int,
    attack_rate: Float,
    move_speed: Int,
  }

  type Teams {
    team_id: Int,
    name: String,
    rating: Float,
    wins: Int,
    losses: Int,
    last_match_time: String,
    tag: String,
    logo_url: String,
  }

  type Query {
    heroes: [Heroes],
    teams: [Teams],
  }
`;