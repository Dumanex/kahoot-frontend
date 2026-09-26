import { create } from "zustand";

const initialState = {
    pinCode: null,
    nickname: null,
    playerId: null,
    rejoinToken: null,

    status: "idle",
    quizTitle: '',
    currentQuestion: null,
    revealEndsAt: 0,
    questionDeadline: 0,
    questionFinalized: false,
    timeRemaining: 0,
    players: [],
    leaderboard: [],
    answeredCount: 0,
    chosenAnswerId: null,
    lastAnswerResult: null,
    roundResults: [],
    serverError: '',
};

const useGameStore = create((set) => ({
    ...initialState,

    setTimer: (seconds) => set({ timeRemaining: seconds }),
    reset: () => set(initialState)
}));

export default useGameStore;
