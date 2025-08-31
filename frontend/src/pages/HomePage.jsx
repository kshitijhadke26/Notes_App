import { NotebookPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import QuickNote from "../components/QuickNote";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left side - Hero Content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Capture ideas instantly with{" "}
              <span className="text-purple-600">NoteFlow</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              A fast, beautiful notes app. Create, edit, and
              organize notes with tags and colors.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() =>
                isAuthenticated
                  ? navigate("/notes")
                  : navigate("/login")
              }
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl focus:shadow-xl transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {isAuthenticated ? "Open Notes" : "Login to Continue"}
            </button>

            {!isAuthenticated && (
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Sign Up Free
              </button>
            )}
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <NotebookPen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Easy Note Creation
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Quickly jot down ideas with our simple,
                  distraction-free editor.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Organized with Tags
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Keep all your notes structured and
                  accessible with color coding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Quick Note (only if authenticated) */}
        {isAuthenticated && (
          <div className="lg:flex lg:justify-center">
            <QuickNote />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;