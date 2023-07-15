const mapping: Record<string, string> = {
  businesses: 'business',
  nonprofits: 'nonprofit',
  rewards: 'reward',
  users: 'user',
  'volunteer-works': 'volunteer_work',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
