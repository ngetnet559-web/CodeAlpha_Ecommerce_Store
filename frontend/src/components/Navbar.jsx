import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "font-semibold text-black"
        : "text-gray-600 hover:text-black"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          ShopStore
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>

          <NavLink to="/cart" className={navLinkClass}>
            <span className="flex items-center gap-2">
              Cart

              {cartCount > 0 && (
                <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </span>
          </NavLink>

          {user && (
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
          )}

          {/* Admin Navigation */}
          {user?.role === "ADMIN" && (
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 text-gray-600 transition hover:text-black"
              >
                Admin
                <span className="text-xs">▼</span>
              </button>

              <div className="invisible absolute right-0 top-full w-48 translate-y-2 rounded-xl border border-gray-200 bg-white p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  to="/admin"
                  className="block rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-black"
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/products"
                  className="block rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-black"
                >
                  Products
                </Link>

                <Link
                  to="/admin/orders"
                  className="block rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-black"
                >
                  Orders
                </Link>
              </div>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>

              <button
                type="button"
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
                className="text-sm font-medium text-gray-600 transition hover:text-black"
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            <NavLink
              to="/"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Products
            </NavLink>

            <NavLink
              to="/cart"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                Cart

                {cartCount > 0 && (
                  <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </span>
            </NavLink>

            {user && (
              <NavLink
                to="/orders"
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                Orders
              </NavLink>
            )}

            {/* Mobile Admin Navigation */}
            {user?.role === "ADMIN" && (
              <div className="border-t border-gray-200 pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Admin
                </p>

                <div className="flex flex-col gap-4">
                  <NavLink
                    to="/admin"
                    className={navLinkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/admin/products"
                    className={navLinkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    Products
                  </NavLink>

                  <NavLink
                    to="/admin/orders"
                    className={navLinkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    Orders
                  </NavLink>
                </div>
              </div>
            )}

            {user ? (
              <div className="border-t border-gray-200 pt-4">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  {user.name}
                </p>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-4">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-gray-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-black px-4 py-2 text-center text-sm font-medium text-white"
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