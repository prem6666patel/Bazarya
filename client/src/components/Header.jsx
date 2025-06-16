import React, { useState } from "react";
import logo from "../assets/Bazarya.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import useMobile from "../hooks/useMobile";
import { useSelector } from "react-redux";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import UserMenu from "./UserMenu";
import DisplayCartItem from "./DisplayCartItem";
import { useGlobalContext } from "../provider/GlobalProvider";
import isAdmin from "../utils/isAdmin";
import { IoHome } from "react-icons/io5";

const Header = () => {
  const isMobile = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { totalPrice, totalQty } = useGlobalContext();

  // const [totalPrice, setTotalPrice] = useState(0);
  // const [totalQty, setTotalQty] = useState(0);

  const user = useSelector((state) => state?.user);
  const cartItem = useSelector((state) => state?.cartItem?.cart || []);

  const isSearchPage = location.pathname === "/search";
  const [openMenu, setOpenUserMenu] = useState(false);

  const [openCart, setOpenCart] = useState(false);

  const handleCloseUserMenu = () => setOpenUserMenu(false);

  const redirectToLogin = () => navigate("/login");

  const handleMobileUser = () => {
    if (!user?._id) navigate("/login");
    else navigate("/userMenu");
  };

  // useEffect(() => {
  //   const qty = cartItem.reduce((prev, curr) => prev + (curr.quantity || 0), 0);
  //   setTotalQty(qty);

  //   const tprice = cartItem.reduce(
  //     (prev, curr) =>
  //       prev + (curr.productId?.price || 0) * (curr.quantity || 0),
  //     0
  //   );
  //   setTotalPrice(tprice);
  // }, [cartItem]);

  const handleToHomePage = () => {
    navigate("/");
  };

  return (
    <div className="h-32 lg:h-20 sticky top-0 z-40 flex flex-col justify-center bg-white">
      {/* Top Nav - Hidden only when on Search page on mobile */}
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center justify-between px-2 lg:shadow-lg pb-3">
          {/* Logo */}
          <Link to="/">
            <img
              src={logo}
              width={150}
              height={100}
              alt="logo"
              className="hidden lg:block"
            />
            <img
              src={logo}
              width={120}
              height={60}
              alt="logo"
              className="lg:hidden"
            />
          </Link>

          {/* Search Bar (desktop only) */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/* User & Cart Buttons */}
          <div>
            {/* Mobile user icon */}
            <button className="lg:hidden" onClick={handleMobileUser}>
              <FaUserAlt size={30} />
            </button>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center gap-12 cursor-pointer">
              {/* User menu or login */}
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex items-center gap-1 select-none"
                  >
                    <p>Account</p>
                    {openMenu ? (
                      <VscTriangleUp size={25} />
                    ) : (
                      <VscTriangleDown size={25} />
                    )}
                  </div>

                  {openMenu && (
                    <div className="absolute right-0 top-12 border bg-white rounded p-4 min-w-52 shadow-md">
                      <UserMenu handleCloseUserMenu={handleCloseUserMenu} />
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLogin} className="text-lg px-3">
                  Login
                </button>
              )}

              {/* Cart button */}

              {!isAdmin(user.role) && (
                <>
                  <button
                    onClick={() => setOpenCart(true)}
                    className="flex items-center bg-green-600 p-3 rounded gap-3 h-14 text-white hover:bg-green-800"
                  >
                    <div className="animate-bounce">
                      <FaShoppingCart className="text-slate-400" size={30} />
                    </div>
                    <div>
                      {cartItem.length > 0 ? (
                        <div className="font-semibold text-base text-white">
                          <p>{totalQty} Items</p>
                          <p>{totalPrice} ₹</p>
                        </div>
                      ) : (
                        <p className="font-semibold text-base">My Cart</p>
                      )}
                    </div>
                  </button>
                </>
              )}

              <button>
                <IoHome size={36} onClick={handleToHomePage} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search bar for mobile view */}
      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>
      {openCart && <DisplayCartItem close={() => setOpenCart(false)} />}
    </div>
  );
};

export default Header;
