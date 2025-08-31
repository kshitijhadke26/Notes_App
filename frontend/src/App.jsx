import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotesPage from "./pages/NotesPage";
import NoteDetailPage from "./pages/NoteDetailPage";

function App() {
	return (
		<div className="min-h-screen bg-gray-50 text-gray-900">
			{/* Navbar */}
			<Navbar />

			{/* Main content */}
			<main className="max-w-7xl mx-auto px-4 py-25">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/notes" element={<NotesPage />} />
					<Route path="/notes/:id" element={<NoteDetailPage />} />
				</Routes>
			</main>

			<Footer />
		</div>
	);
}

export default App;
