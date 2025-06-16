import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdBackspace } from "react-icons/io";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [query, setQuery] = useState("");
  const isMobile = useMobile();

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);

    // On mount, set query from URL if exists
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (isSearch && q) setQuery(q);
  }, [location]);

  // 🟡 Instant update of query in URL when typing
  useEffect(() => {
    if (isSearchPage) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query]);

  const redirectToSearchPage = () => {
    navigate("/search?q=");
  };

  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center bg-gray-100">
      <div>
        {isMobile && isSearchPage ? (
          <Link
            to={"/"}
            type="button"
            className="flex justify-center items-center h-full p-3 text-neutral-800"
          >
            <IoMdBackspace size={22} />
          </Link>
        ) : (
          <button
            type="button"
            className="flex justify-center items-center h-full p-3 text-neutral-800"
          >
            <FaSearch size={22} />
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex items-center cursor-pointer"
          >
            <TypeAnimation
              sequence={[
                "Search 'Milk'",
                1000,
                "Search 'Bread'",
                1000,
                "Search 'Sugar'",
                1000,
                "Search 'Paneer'",
                1000,
                "Search 'Cheese'",
                1000,
                "Search 'Chocolate'",
                1000,
              ]}
              wrapper="span"
              speed={0}
              repeat={Infinity}
              className="text-gray-500"
            />
          </div>
        ) : (
          <input
            type="text"
            autoFocus
            placeholder="Search here"
            className="bg-transparent w-full h-full outline-none px-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
