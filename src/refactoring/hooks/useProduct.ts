import { useCallback, useState } from 'react';
import { Product } from '../models/types/Product.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  }, []);

  return {
    products,
    updateProduct,
    addProduct,
  };
};
