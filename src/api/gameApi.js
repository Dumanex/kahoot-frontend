import api from "./axios"

export const createSession = (quizId, visibility = "PRIVATE") => api.post('/games/host', { quizId, visibility });
export const startGame = (pin) => api.post(`/games/${pin}/start`);
export const nextQuestion = (pin) => api.post(`/games/${pin}/next`);
export const endGame = (pin) => api.post(`/games/${pin}/end`);
export const getPublicGames = (q = '', page = 0) => api.get('/games/public', { params: { q, page } });
export const joinGame = (pin, nickname) => api.post(`/games/${pin}/join`, { nickname });
export const rejoinGame = (pin, playerId, rejoinToken) => api.post(`/games/${pin}/rejoin`, { playerId, rejoinToken });
export const getGameState = (pin) => api.get(`/games/${pin}/state`);
export const getMyGames = () => api.get('/games/mine');