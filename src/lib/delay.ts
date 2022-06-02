export const delay = (time: number): Promise<NodeJS.Timeout> => new Promise((res) => setTimeout(res, time));
