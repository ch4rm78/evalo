import React from "react";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";
import toast from "react-hot-toast";

const HomePage = () => {
  return (
    <div>
      <h1>Welcom to the Home Page</h1>
      <button
        className="btn"
        onClick={() => toast.success("This is a success toast")}
      >
        Click Me
      </button>

      <SignedOut>
        <SignInButton mode="modal" className="btn btn-secondary" />
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton />
    </div>
  );
};

export default HomePage;
