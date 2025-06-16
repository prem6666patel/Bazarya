import { useEffect, useState } from "react";

const useMobile = (breakPoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakPoint);

  const handleResize = () => {
    const checkPoint = window.innerWidth < breakPoint;
    setIsMobile(checkPoint);
  };

  useEffect(() => {
    handleResize(); // Optional, since initial state is already set
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakPoint]); // include breakPoint in dependencies

  return isMobile; // <-- This was missing
};

export default useMobile;
