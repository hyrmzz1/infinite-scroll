import { useEffect, useRef, useState } from "react";
import { getMockData, MockData } from "./mocks/mockData";
import ProductCard from "./components/ProductCard";

const App = () => {
  const [products, setProducts] = useState<MockData[]>([]); // 불러온 데이터 저장
  const [page, setPage] = useState(0); // 현재 페이지
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false); // 다음 페이지 없으면 무한 스크롤 호출 X
  const [pageParams, setPageParams] = useState<Number[]>([]); // 페이지 호출 히스토리 관리
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchProducts = async () => {
    if (pageParams.includes(page)) return; // 페이지 중복 호출 방지

    setLoading(true); // 데이터 불러오는 동안 로딩 상태 유지
    // console.log("로딩 시작");

    const { datas, isEnd } = await getMockData(page); // page에 해당하는 데이터, 다음 페이지 유무 받아오기

    setProducts((prevProducts) => [...prevProducts, ...datas]); // 기존 데이터에 새로운 페이지 데이터 이어 붙이기
    setPageParams((prev) => [...prev, page]); // 호출한 페이지 번호 저장
    setHasNextPage(!isEnd); // 다음 페이지 유무 상태 설정
    setLoading(false); // 데이터 페칭 및 처리 완료, 로딩 상태 종료
    // console.log("로딩 끝");
  };

  // page 바뀔 때마다 fetchProducts 함수 호출
  useEffect(() => {
    fetchProducts();
    // console.log("현재 페이지", page);
  }, [page]);

  useEffect(() => {
    // observerRef 요소가 뷰포트에 들어왔는지 감지
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0]; // 관찰 중인 첫 번째 요소

      // 요소가 화면에 들어왔을 때 동작
      // !loading 조건 통해 중복 로딩 방지 (조건 없으면 "로딩 끝" 로그 중복으로 찍힘)
      if (firstEntry.isIntersecting && hasNextPage && !loading) {
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
    <>
      {products.map((elem) => (
        <ProductCard product={elem} />
      ))}

      <div ref={observerRef}>Load more</div>
    </>
  );
};

export default App;
