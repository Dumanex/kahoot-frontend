import api from "./axios"

export const createSession = (quizId) => api.post('/games/host', { quizId });
export const getSession = (pin) => api.get(`/games/${pin}`);
export const startGame = (pin) => api.post(`/games/${pin}/start`);
export const nextQuestion = (pin) => api.post(`/games/${pin}/next`);
export const endGame = (pin) => api.post(`/games/${pin}/end`);