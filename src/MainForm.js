import { useState } from "react"
import styled from "styled-components"
import { toast } from "react-toastify"
import fasta from "biojs-io-fasta"
import { sleep, readFastq, searchReadsInGenome, isOnlyGene } from "./utils"

const MainForm = () => {
	const [genome, setGenome] = useState("")
	const [reads, setReads] = useState([])
	const [sliceIndex, setSliceIndex] = useState(8)
	const [results, setResults] = useState([])

	const handleGenomeFile = async e => {
		const rawFasta = await e.target.files[0].text()

		try {
			const fetchedGenome = fasta.parse(rawFasta)[0].seq
			if(isOnlyGene(fetchedGenome) == false){
				throw Error("ITS NOT ATGCN only")
			}

			setGenome(fetchedGenome)
			window.genome = fetchedGenome
		} catch(e) {
			console.error(e)
			toast.error("Invalid or corrupt fasta file", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			})
		}
	}
	const handleReadsFile = async e => {
		const raw = await e.target.files[0].text()
		const fetchedReads = readFastq(raw)
			.map(read => read.slice(0, sliceIndex || 8))
		setReads(fetchedReads)
	}

	const handleProcess = async () => {
		toast.promise(
			sleep(1000)()
			.then(async () => {
				const results = await searchReadsInGenome(reads, genome)
				setResults(results)
			}), {
			pending: "Process is running",
			success: "Data is being rendered",
			error: "An error occured"
		}, {
			position: "top-center",
		})
	}

	return (
		<Container>
			<h2>Part of bioinformatics project series<br/>by Euel M. Lemma</h2>
			<h1>Step 1: Upload refrence genome</h1>
			<Note>[ Small file sizes are highly recommended for testing ]</Note>
			<Space h="1rem" />
			<File type="file" accept=".fasta,.fna,.ffn,.faa,.frn,.fa"
				onChange={handleGenomeFile} />
			<Space h="1rem" />

			<h1>Step 2: Upload/paste sequence reads</h1>
			<h3>Slice Index</h3>
			<Input placeholder="Slice Index" value={sliceIndex}
				onChange={e => setSliceIndex(e.target.value)} />
			<Space h="1rem" />
			<File type="file" accept=".fastq"
				onChange={handleReadsFile} />
			<Space h="0.5rem" />

			
			<Space h="1rem" />
			<Button onClick={handleProcess}>Process</Button>

			<Space h="2rem" />
			<Divider />
			<Space h="1rem" />

			<Row>
				<Header width="20%">Read Index</Header>
				<Header width="40%">Read Preview</Header>
				<Header width="40%">Match Indexes</Header>
			</Row>
			{results.length == 0 ? <NoResult>Not one match found :(</NoResult> :
				results.map(result => (
					<>
						<Row>
							<Cell width="20%">{result.readIndex}</Cell>
							<Cell width="40%">{result.read.slice(0, 100)}</Cell>
							<Cell width="40%">{result.matchIndexes.join(", ")}</Cell>
						</Row>
						<Space h="1rem" />
					</>
				))}
		</Container>
	)
}

const NoResult = styled.div`
	font-size: 1.2rem;
	font-weight: bold;
	text-align: center;
	margin: 2rem;
	color: var(--primary);
`
const Row = styled.div`
	display: flex;
	flex-direction: row;
`
const Header = styled.div`
	display: flex;
	font-weight: bold;
	font-size: 1.1rem;
	flex-grow: 1;
	width: ${props => props.width};
`
const Cell = styled.div`
	flex-grow: 1;
	width: ${props => props.width};
	word-wrap: break-word;
`
const Container = styled.div`
	display: flex;
	flex-direction: column;
`

const Select = styled.select`
	color: #242424;
	background: #fefefe;
	font-weight: bold;
	font-size: 1.1rem;
	border: 2px solid var(--primary);
	border-radius: 4px;
	padding: 1rem;
	// width: max-content;
	width: 100%;
`

const File = styled(Select).attrs({ as: "input" })``

const Input = styled.input`
	box-sizing: border-box;
	background: #fff;
	border: 2px solid var(--primary);
	box-shadow: 0px 1px 5px rgba(0,0,0,0.1);
	border-radius: 8px;
	padding: 0.7rem 1rem;
	color: #363636;
`


const Space = styled.div`
	height: ${prop => prop.h || 0};
	width: ${prop => prop.w || 0};

	@media screen and (max-width: 64em) {
		height: ${prop => prop.mh || prop.h || 0};
		width: ${prop => prop.mw || prop.w || 0}
	}
`

const Divider = styled.div`
	border-bottom: 7px solid var(--secondary);
`

const Button = styled.div`
	width: 8rem;
	border-radius: 8px;
	display: flex;
	font-weight: bold;
	font-size: 1.1rem;
	margin: 0 auto;
	justify-content: center;
	align-items: center;
	color: #eee;
	cursor: pointer;
	padding: 1rem;
	border: 2px solid var(--primary);
	background: var(--primary);

	:hover {
		background: var(--secondary);
		color: #fff;
	}
`
const Note = styled.div`
	font-weight: bold;
`


export default MainForm
