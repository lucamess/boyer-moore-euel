import 'react-toastify/dist/ReactToastify.css';
import styled, { createGlobalStyle } from "styled-components"
import { ToastContainer } from 'react-toastify';
import MainForm from "./MainForm"


const GlobalStyle = createGlobalStyle`
	:root {
		--primary: #FFB000;
		--secondary: #FFCF9D;
	}

	body {
		padding: 0;
		margin: 0;
		border: 0;
		outline: 0;
		// background: #f0f0ff;
	}

	* {
		box-sizing: border-box;
		font-family: 'Inter', sans-serif;
	}

	h1, h2, h3, h4 {
		color: #242424;
	}
`

const App = () => {

	return (
		<>
			<GlobalStyle />
			<ToastContainer />
			<HeaderCont>
				<Header>
					<HeaderMain>Boyer Moore on DNA reads</HeaderMain>
				</Header>
			</HeaderCont>
			<Container>
				<MainForm />
			</Container>
		</>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 700px;
	margin: 0 auto;
	padding: 0 2rem;
`

const HeaderCont = styled.div`
	display: flex;
	align-items: center;
	background: var(--primary);
	height: 5rem;
	padding: 0 2rem;
`
const Header = styled.div`
	width: 100%;
	max-width: 1200px;
	margin: 2rem auto;
	font-size: 1.5rem;
	color: black;
`
const HeaderMain = styled.div`
	font-size: 1.5rem;
`
const HeaderSub = styled.div`
	font-weight: bold;
	font-size: 1rem;
`

// SUBSTITUDED DIV WITH SPAN
const Space = styled.div`
	height: ${prop => prop.h || 0};
	width: ${prop => prop.w || 0};

	@media screen and (max-width: 64em) {
		height: ${prop => prop.mh || prop.h || 0};
		width: ${prop => prop.mw || prop.w || 0}
	}
`

export default App

