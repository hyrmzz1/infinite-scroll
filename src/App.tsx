import { useEffect, useRef, useState } from "react";
import { getMockData, MockData } from "./mocks/mockData";
import ProductCard from "./components/ProductCard";
import { PacmanLoader } from "react-spinners";

const App = () => {
  const [products, setProducts] = useState<MockData[]>([]); // 불러온 데이터 저장
  let [totalPrice, setTotalPrice] = useState(0); // 불러온 데이터 price 총 합
  const [page, setPage] = useState(0); // 현재 페이지
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false); // 다음 페이지 없으면 무한 스크롤 호출 X
  const [pageParams, setPageParams] = useState<Number[]>([]); // 페이지 호출 히스토리 관리
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchProducts = async () => {
    if (pageParams.includes(page)) return; // 페이지 중복 호출 방지

    setLoading(true); // 데이터 불러오는 동안 로딩 상태 유지
    // console.log("로딩 시작");

    try {
      const { datas, isEnd } = await getMockData(page); // page에 해당하는 데이터, 다음 페이지 유무 받아오기

      setProducts((prevProducts) => [...prevProducts, ...datas]); // 기존 데이터에 새로운 페이지 데이터 이어 붙이기

      // 금액 합계에 새로운 페이지 데이터들의 금액 추가
      const newTotalPrice = datas.reduce((acc, curr) => acc + curr.price, 0);
      setTotalPrice((prevTotal) => prevTotal + newTotalPrice);

      setPageParams((prev) => [...prev, page]); // 호출한 페이지 번호 저장
      setHasNextPage(!isEnd); // 다음 페이지 유무 상태 설정
      // console.log("로딩 끝");
    } catch (error) {
      setHasNextPage(false);
    } finally {
      setLoading(false); // 데이터 페칭 및 처리 완료 이후 또는 에러 발생시 로딩 상태 종료
    }
  };

  // page 바뀔 때마다 fetchProducts 함수 호출
  useEffect(() => {
    fetchProducts();
    // console.log("현재 페이지", page);
  }, [page]);

  useEffect(() => {
    if (hasNextPage && !loading) return;

    // observerRef 요소가 뷰포트에 들어왔는지 감지
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0]; // 관찰 중인 첫 번째 요소

      // 요소가 화면에 들어왔을 때 동작
      if (firstEntry.isIntersecting) {
        setPage((prevPage) => prevPage + 1); // 다음 페이지 설정
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    // 컴포넌트 언마운트 or observerRef가 변경될 때 관찰 중단
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, loading]);

  return (
    <main className="flex flex-col items-center py-10">
      <p className="text-2xl font-extrabold">Product List</p>
      <div className="grid grid-cols-3 gap-4 my-10">
        {products.map((elem) => (
          <ProductCard product={elem} key={elem.productId} />
        ))}
      </div>

      <p className="font-bold text-lg">
        Total Price: ${totalPrice.toLocaleString()}
      </p>

      {hasNextPage && (
        <div ref={observerRef} className="mt-5">
          <PacmanLoader speedMultiplier={0.75} size={20} />
        </div>
      )}
    </main>
  );
};

export default App;
