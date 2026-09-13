import useGameStore from "../stores/gameStore";

function PlayerGame() {
    const pinCode = useGameStore((state) => state.pinCode);
    const nickname = useGameStore((state) => state.nickname);

    return (
        <div>
            <h1>Player Game</h1>
            <p>PIN: {pinCode}</p>
            <p>Nadimak: {nickname}</p>
        </div>
    );
}

export default PlayerGame;