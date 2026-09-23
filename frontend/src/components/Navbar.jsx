import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          ShopStore
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className={`text-sm font-medium transition ${
              isActive("/")
                ? "text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Home
          </Link>

          <Link
            to="/products"
            className={`text-sm font-medium transition ${
              isActive("/products")
                ? "text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Products
          </Link>

          {user && (
            <Link
              to="/orders"
              className={`text-sm font-medium transition ${
                location.pathname.startsWith("/orders")
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Orders
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/cart"
            className="relative flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            <span className="text-lg">🛒</span>
            <span>Cart</span>

            {cartCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Hi,{" "}
                <span className="font-medium text-gray-900">
                  {user.name}
                </span>
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-black"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            to="/cart"
            className="relative text-lg"
            aria-label="Shopping cart"
          >
            🛒

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="text-2xl text-gray-900"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <Link
              to="/"
              className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                isActive("/")
                  ? "bg-gray-100 text-black"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                isActive("/products")
                  ? "bg-gray-100 text-black"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Products
            </Link>

            {user && (
              <Link
                to="/orders"
                className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                  location.pathname.startsWith("/orders")
                    ? "bg-gray-100 text-black"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Orders
              </Link>
            )}

            <div className="my-3 border-t border-gray-100" />

            {user ? (
              <div className="space-y-3 px-4 py-3">
                <p className="text-sm text-gray-600">
                  Signed in as{" "}
                  <span className="font-medium text-gray-900">
                    {user.name}
                  </span>
                </p>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="block rounded-lg bg-black px-4 py-3 text-center text-sm font-medium text-white hover:bg-gray-800"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;