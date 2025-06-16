import React from "react";
import banner from "../assets/banner.jpg";
import bannermobile from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
import { valideUrlCovert } from "../utils/valideUrlConverter";
import { useNavigate, Link } from "react-router-dom";
import CategoryWiseProduct from "../components/CategoryWiseProduct";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allsubCategory);
  const navigate = useNavigate();
   console.log("subCategoryData : ", subCategoryData);

  const handleRedirectProductListPage = (id, cat) => {
    console.log("id : ", id);
    console.log("cat : ", cat);
    const filteredSubCategories = subCategoryData.filter(
      (subCat) => subCat.category._id === id
    );

    if (filteredSubCategories.length > 0) {
      const firstSubCat = filteredSubCategories[0];
      const url = `/${valideUrlCovert(cat)}-${id}/${valideUrlCovert(
        firstSubCat.name
      )}-${firstSubCat._id}`;
      navigate(url);
      console.log("url : ", url);
    } else {
      console.warn("No sub-categories found for category ID:", id);
    }

    console.log("Filtered Sub-categories: ", filteredSubCategories);
  };

  return (
    <>
      <section className="bg-blue-50">
        <div className="rounded-xl overflow-hidden">
          <div className="min-h-[10rem] w-full">
            <img
              src={banner}
              alt="Banner"
              className="w-full h-full object-cover hidden lg:block"
            />
            <img
              src={bannermobile}
              alt="Banner"
              className="w-full h-full object-cover lg:hidden"
            />
          </div>
        </div>
        <div className="container mx-auto px-2 my-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-2">
          {loadingCategory
            ? Array.from({ length: 30 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-white rounded min-h-40 grid gap-2 animate-pulse"
                >
                  <div className="bg-blue-100 min-h-32 rounded"></div>
                  <div className="bg-blue-100 h-8 rounded"></div>
                </div>
              ))
            : categoryData.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-white rounded flex flex-col items-center hover:cursor-pointer"
                  onClick={() =>
                    handleRedirectProductListPage(cat._id, cat.name)
                  }
                >
                  <div className="w-full h-44 flex items-center justify-center">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              ))}
        </div>
        {categoryData.map((c) => {
          return <CategoryWiseProduct id={c._id} name={c.name} />;
        })}
      </section>
    </>
  );
};

export default Home;
