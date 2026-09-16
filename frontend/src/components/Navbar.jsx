import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/products"
          className="text-xl font-bold text-gray-900"
        >
          E-Commerce
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/products"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Cart
          </Link>

          {token && (
            <Link
              to="/orders"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Orders
            </Link>
          )}

          {token ? (
            <button
              onClick={handleLogout}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-black"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;