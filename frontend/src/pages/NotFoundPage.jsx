import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Button from "../components/common/Button";

export const NotFoundPage = () => {
  return (
    <div className="pt-32 pb-20 text-center max-w-md mx-auto px-4 min-h-[60vh] flex flex-col items-center justify-center">
      <span className="text-6xl font-black text-amber-600 font-display-luxury block mb-2">
        404
      </span>
      <h1 className="text-2xl font-bold font-display-luxury text-stone-900 mb-2">
        Page Not Found
      </h1>
      <p className="text-xs text-stone-500 mb-6">
        The page you are looking for does not exist or has been relocated.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" icon={Home}>
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
