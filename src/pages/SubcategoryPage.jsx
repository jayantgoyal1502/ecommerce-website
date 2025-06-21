import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function SubcategoryPage() {
  const { categoryName, subcategoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5050/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Filter by category and subcategory
        const filtered = data.filter(
          (p) =>
            p.type?.toLowerCase() === categoryName.toLowerCase() &&
            (p.subcategory?.toLowerCase() === subcategoryName.toLowerCase() ||
             p.subcategory === subcategoryName)
        );
        setProducts(filtered);
        setLoading(false);
      });
  }, [categoryName, subcategoryName]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {categoryName} / {subcategoryName}
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div>No products found in this subcategory.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
