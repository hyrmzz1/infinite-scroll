import { MockData } from "../mocks/mockData";

interface ProductCardProps {
  product: MockData;
}

const ProductCard = ({ product }: ProductCardProps) => {
  let boughtDate = new Date(product.boughtDate); // UTC 기준
  const offset = new Date().getTimezoneOffset() * 60000;

  boughtDate = new Date(boughtDate.getTime() - offset); // 한국 표준시 기준으로 보정
  const boughtDateStr = boughtDate.toISOString().split("T")[0];

  return (
    <div className="w-64 px-3 rounded-lg bg-gray-200 divide-y-2 divide-solid divide-gray-400">
      <p className="py-3 font-bold text-lg text-center truncate">
        {product.productName}
      </p>
      <div className="py-3">
        <p>Price: ${product.price}</p>
        <p>Bought Date: {boughtDateStr}</p>
      </div>
    </div>
  );
};

export default ProductCard;
