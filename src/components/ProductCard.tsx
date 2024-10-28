import { MockData } from "../mocks/mockData";

interface ProductCardProps {
  product: MockData;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-slate-300 m-7">
      <p>{product.productId}</p>
      <p>{product.productName}</p>
      <p>{product.price}</p>
      <p>{product.boughtDate}</p>
    </div>
  );
};

export default ProductCard;
