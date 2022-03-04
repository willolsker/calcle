function* pseudoRandom(seed: number) {
    const len = seed.toString().length;
    let val = seed;

    while (true) {
        val = parseFloat(
            (val ** 2)
                .toString()
                .replace(".", "")
                .substring(0, len)
        );
        yield val;
    }
}

export default pseudoRandom;