import {
  SignedOut,
  SignInButton,
  SignedIn,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";

function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/dashboard"
          element={isSignedIn ? <Dashboard /> : <Navigate to={"/"} />}
          // element={<Dashboard />}
        />
        <Route
          path="/problems"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/problem/:id"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
