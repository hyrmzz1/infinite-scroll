import { MockData } from "../mocks/mockData";

interface ProductCardProps {
  product: MockData;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr); // UTC 기준
  const offset = new Date().getTimezoneOffset() * 60000;

  const boughtDate = new Date(date.getTime() - offset); // 한국 표준시 기준으로 보정
  return boughtDate.toISOString().split("T")[0];
};

const ProductCard = ({ product }: ProductCardProps) => {
  const formattedBoughtDate = formatDate(product.boughtDate);

  return (
    <div className="w-64 px-3 rounded-lg bg-gray-200 divide-y-2 divide-solid divide-gray-400">
      <p className="py-3 font-bold text-lg text-center truncate">
        {product.productName}
      </p>
      <div className="py-3">
        <p>Price: ${product.price.toLocaleString()}</p>
        <p>Bought Date: {formattedBoughtDate}</p>
      </div>
    </div>
  );
};

export default ProductCard;
