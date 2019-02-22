export const INTERVAL =
  process.env.INTERVAL !== undefined && !isNaN(parseInt(process.env.INTERVAL)) ? parseInt(process.env.INTERVAL) : 1024;
export const URL = process.env.URL || 'https://thiscatdoesnotexist.com/';
