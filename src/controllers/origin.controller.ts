const originIsAllowed = (origin: string) => {
    const n = origin.includes("game-linter.com");
    return n;
}

export default originIsAllowed