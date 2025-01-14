import React, { useState } from 'react';
import { Product } from '../models/types/Product';
import { Coupon } from '../models/types/Coupon';
import { useOthers } from '../hooks/useOthers';
import ProductForm from './admin/ProductForm';
import ManageCoupon from './admin/ManageCoupon';

interface Props {
  products: Product[];
  onProductAdd: (product: Product) => void;
  onProductUpdate: (product: Product) => void;
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

function AdminPage({
  products,
  onProductAdd,
  onProductUpdate,
  coupons,
  onCouponAdd,
}: Props) {
  const {
    editingProduct,
    newDiscount,
    handlers: {
      handleEditProduct,
      handleProductNameUpdate,
      handlePriceUpdate,
      handleStockUpdate,
      handleAddDiscount,
      handleRemoveDiscount,
      handleEditComplete,
      handleUpdateNewDiscountQuantity,
      handleUpdateNewDiscountRate,
    },
  } = useOthers({
    products,
    updateProduct: onProductUpdate,
  });
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            type="button"
            onClick={() => setShowNewProductForm((prev) => !prev)}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {showNewProductForm ? '취소' : '새 상품 추가'}
          </button>
          <ProductForm
            addProduct={onProductAdd}
            isOpen={showNewProductForm}
            setFormState={setShowNewProductForm}
          />
          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                data-testid={`product-${index + 1}`}
                className="bg-white p-4 rounded shadow"
              >
                <button
                  type="button"
                  data-testid="toggle-button"
                  onClick={() => toggleProductAccordion(product.id)}
                  className="w-full text-left font-semibold"
                >
                  {product.name} - {product.price}원 (재고: {product.stock})
                </button>
                {openProductIds.has(product.id) && (
                  <div className="mt-2">
                    {editingProduct && editingProduct.id === product.id ? (
                      <div>
                        <div className="mb-4">
                          <span className="block mb-1">상품명: </span>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) =>
                              handleProductNameUpdate(
                                product.id,
                                e.target.value,
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div className="mb-4">
                          <span className="block mb-1">가격: </span>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                              handlePriceUpdate(
                                product.id,
                                Number(e.target.value),
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div className="mb-4">
                          <span className="block mb-1">재고: </span>
                          <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) =>
                              handleStockUpdate(
                                product.id,
                                Number(e.target.value),
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        {/* 할인 정보 수정 부분 */}
                        <div>
                          <h4 className="text-lg font-semibold mb-2">
                            할인 정보
                          </h4>
                          {editingProduct.discounts.map((discount) => (
                            <div
                              key={discount.rate}
                              className="flex justify-between items-center mb-2"
                            >
                              <span>
                                {discount.quantity}개 이상 구매 시{' '}
                                {discount.rate * 100}% 할인
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveDiscount(product.id, index)
                                }
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                삭제
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              placeholder="수량"
                              value={newDiscount.quantity}
                              onChange={(e) =>
                                handleUpdateNewDiscountQuantity(
                                  Number(e.target.value),
                                )
                              }
                              className="w-1/3 p-2 border rounded"
                            />
                            <input
                              type="number"
                              placeholder="할인율 (%)"
                              value={newDiscount.rate * 100}
                              onChange={(e) =>
                                handleUpdateNewDiscountRate(
                                  Number(e.target.value) / 100,
                                )
                              }
                              className="w-1/3 p-2 border rounded"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddDiscount(product.id)}
                              className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                              할인 추가
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleEditComplete}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
                        >
                          수정 완료
                        </button>
                      </div>
                    ) : (
                      <div>
                        {product.discounts.map((discount) => (
                          <div key={discount.rate} className="mb-2">
                            <span>
                              {discount.quantity}개 이상 구매 시{' '}
                              {discount.rate * 100}% 할인
                            </span>
                          </div>
                        ))}
                        <button
                          type="button"
                          data-testid="modify-button"
                          onClick={() => handleEditProduct(product)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <ManageCoupon coupons={coupons} onCouponAdd={onCouponAdd} />
      </div>
    </div>
  );
}

export default AdminPage;
