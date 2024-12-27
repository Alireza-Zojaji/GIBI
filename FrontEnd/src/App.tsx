import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { usePageStore } from './store/usePageStore';
import NotFoundPage from './views/not-found';
import NavBar from './components/containers/navbar';

function App() {
	const { pages } = usePageStore();

	return (
		<Router>
			<main className="">
				<NavBar />
				<div className="pt-[8dvh] pb-10 px-6 max-w-[1920px] mx-auto">
					<Routes>
						{pages.map((thePage, index) => (
							<Route
								key={index}
								path={thePage.route}
								element={<thePage.component />}
							/>
						))}

						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</div>
			</main>
		</Router>
	);
}

export default App;
