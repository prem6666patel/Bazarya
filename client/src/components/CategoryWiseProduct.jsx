import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";


const CategoryWiseProduct = ({ id, name }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // console.log("products : ", products);

  const loadingCardNumber = new Array(7).fill(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/product/getProductByCategory",
          { id }
        );
        setProducts(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  return (
    <div className="">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <h1 className="ml-6 font-semibold text-3xl">{name}</h1>
        {/* <Link
          to={`/category/${id}`}
          className="mr-7 text-green-600 hover:text-green-400"
        >
          See More
        </Link> */}
      </div>
      {/* Responsive Loading Cards */}
      <div className="flex overflow-x-auto hide-scrollbar">
        <div className="flex gap-5 min-w-max ml-6 mr-4 md:gap-5 lg:gap-4 ">
          {loading &&
            loadingCardNumber.map((_, index) => (
              <div key={index} className="max-w-96 flex-shrink-0">
                <CardLoading />
              </div>
            ))}
          {
            products.map((p,index)=>{
                return(
                  <CardProduct key={p._id+index} data={p} />
                )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProduct;
