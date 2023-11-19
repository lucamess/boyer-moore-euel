

const preProcess = p => {
    let table = [];
    for(let i = 0; i < 256; i++) {
        table[i] = p.length;
    }
    for(let i = 0; i < p.length - 1; i++) {
        table[p.charCodeAt(i)] = p.length - 1 - i;
    }
    return table;
}

const boyerMooreSearch = (text, pattern) => {
    let table = preProcess(pattern);
    let shift = pattern.length;
    while (text.length >= shift) {
        if (text.substr(shift - pattern.length, pattern.length) == pattern) {
            return text.length - shift;
        }
        shift += Math.max(1, table[text.charCodeAt(shift - pattern.length)]);
    }
    return -1;
}

export const multipleBoyerMooreSearch = (text, pattern) => {
	const indexes = []
	let edittedText = text
	while(true) {
		const index = boyerMooreSearch(edittedText, pattern)
		if(index == -1)
			break;

		indexes.push(index)
		edittedText = edittedText.slice(index + 1)

		if(edittedText.length == 0)
			break;
	}

	return indexes
}

export const isOnlyGene = seq => {
	for(let i=0; i<seq.length; i++) {
		if(seq[i] != "A" && seq[i] != "T" && seq[i] != "C" && seq[i] != "G" && seq[i] != "N")
			return false
	}

	return true
}

export const sleep = (ms) => (value) => {
	return new Promise((res) => {
		setTimeout(() => res(value), ms)
	})
}

export const searchReadsInGenome = async (reads, genome) => {
	const result = []
	reads.forEach((read, readIndex) => {
		const matchIndexes = multipleBoyerMooreSearch(genome, read)
		if(matchIndexes.length > 0)
			result.push({
				read,
				readIndex,
				matchIndexes
			})
	})

	return result
}

export const readFastq = (raw) => {
	const rawSplitted = raw.split("\n")
	const reads = []
	for(let i=1; i<rawSplitted.length; i+=4) {
		reads.push(rawSplitted[i])
	}

	return reads
}



