import { create } from "zustand";

const useGameStore = create((set) => ({
    pinCode: null,
    nickname: null,
    playerId: null,
    isHost: null,

    status: "idle",
    currentQuestion: null,
    timeRemaining: 0,
    players: [],
    leaderboard: [],
    answeredCount: 0,
    lastAnswerResult: null,
    roundResults: [],

    setPinCode: (pin) => set({ pinCode: pin }),
    setNickname: (name) => set({ nickname: name }),
    setPlayerId: (id) => set({ playerId: id }),
    setHost: () => set({ isHost: true }),
    setStatus: (status) => set({ status }),
    setCurrentQuestion: (question) => set({ currentQuestion: question }),
    setTimer: (seconds) => set({ timeRemaining: seconds }),
    setPlayers: (players) => set({ players }),
    setLeaderboard: (scores) => set({ leaderboard: scores }),
    setAnsweredCount: (count) => set({ answeredCount: count }),
    setLastAnswerResult: (result) => set({ lastAnswerResult: result }),
    addRoundResult: (result) => set((state) => ({
      roundResults: [...state.roundResults.filter((r) => r.playerId !== result.playerId), result]
    })),
    
    reset: () => set({
      pinCode: null, nickname: null, playerId: null, isHost: false,
      status: 'idle', currentQuestion: null, timeRemaining: 0,
      players: [], leaderboard: [], answeredCount: 0, lastAnswerResult: null,
      roundResults: []
    })
}));

export default useGameStore;