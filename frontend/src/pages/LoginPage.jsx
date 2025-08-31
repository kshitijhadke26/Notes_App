import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!form.email || !form.password) {
      setError("All fields are required");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Enter a valid email address");
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
      await login(form.email, form.password);
      navigate("/notes");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-140px)] from-indigo-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Log in to continue taking notes.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
              className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
              className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 focus:bg-purple-700"
            } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-sm text-gray-600 mt-6 text-center">
          No account?{" "}
          <Link
            to="/signup"
            className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;