import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function SignupPage() {
	const { signup } = useAuth();
	const navigate = useNavigate();
	const [form, setForm] = useState({ username: "", email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const validateForm = () => {
		if (!form.username || !form.email || !form.password) {
			setError("All fields are required");
			return false;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(form.email)) {
			setError("Enter a valid email address");
			return false;
		}
		if (form.password.length < 6) {
			setError("Password must be at least 6 characters");
			return false;
		}
		setError("");
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setLoading(true);
		try {
			await signup(form.username, form.email, form.password);
			navigate("/notes");
		} catch (err) {
			setError("Signup failed. User may already exist.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-[calc(100vh-120px)] from-indigo-50 to-white px-4">
			<div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
				{/* Title */}
				<h2 className="text-2xl font-bold text-gray-800">
					Create your account
				</h2>
				<p className="text-sm text-gray-500 mt-1 mb-6">
					Start capturing ideas in seconds.
				</p>

				{/* Error Message */}
				{error && (
					<div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-sm">
						{error}
					</div>
				)}

				{/* Signup Form */}
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Name
						</label>
						<input
							type="text"
							placeholder="Jane Doe"
							value={form.username}
							onChange={(e) =>
								setForm({ ...form, username: e.target.value })
							}
							className="w-full mt-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Email
						</label>
						<input
							type="email"
							placeholder="you@example.com"
							value={form.email}
							onChange={(e) =>
								setForm({ ...form, email: e.target.value })
							}
							className="w-full mt-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Password
						</label>
						<input
							type="password"
							placeholder="••••••••"
							value={form.password}
							onChange={(e) =>
								setForm({ ...form, password: e.target.value })
							}
							className="w-full mt-1 border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className={`w-full py-2.5 rounded-lg text-white font-medium transition cursor-pointer ${
							loading
								? "bg-indigo-400 cursor-not-allowed"
								: "bg-indigo-600 hover:bg-indigo-700"
						}`}>
						{loading ? "Signing up..." : "Sign Up"}
					</button>
				</form>

				{/* Login Link */}
				<p className="text-sm text-gray-600 mt-6 text-center">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-indigo-600 hover:underline font-medium">
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
}

export default SignupPage;
