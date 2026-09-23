import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              ShopStore
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-gray-500">
              A simple and reliable place to discover products, shop
              with confidence, and manage your orders with ease.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Shop
            </h2>

            <div className="mt-4 space-y-3">
              <Link
                to="/products"
                className="block text-sm text-gray-500 transition hover:text-black"
              >
                All Products
              </Link>

              <Link
                to="/cart"
                className="block text-sm text-gray-500 transition hover:text-black"
              >
                Shopping Cart
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Account
            </h2>

            <div className="mt-4 space-y-3">
              <Link
                to="/login"
                className="block text-sm text-gray-500 transition hover:text-black"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block text-sm text-gray-500 transition hover:text-black"
              >
                Register
              </Link>

              <Link
                to="/orders"
                className="block text-sm text-gray-500 transition hover:text-black"
              >
                My Orders
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ShopStore. All rights reserved.
          </p>

          <p className="text-sm text-gray-400">
            Built with React, Express & PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;