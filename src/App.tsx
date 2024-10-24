import { useEffect, useState } from "react";
import { getMockData, MockData } from "./mocks/mockData";

const App = () => {
  const [products, setProducts] = useState<MockData[]>([]); // 불러온 데이터 저장
  const [page, setPage] = useState(0); // 현재 페이지
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false); // 다음 페이지 없으면 무한 스크롤 호출 X
  const [pageParams, setPageParams] = useState<Number[]>([]); // 페이지 호출 히스토리 관리

  const fetchProducts = async () => {
    if (pageParams.includes(page)) return; // 페이지 중복 호출 방지

    setLoading(true); // 데이터 불러오는 동안 로딩 상태 유지

    const { datas, isEnd } = await getMockData(page); // page에 해당하는 데이터, 다음 페이지 유무 받아오기

    setProducts((prevProducts) => [...prevProducts, ...datas]); // 기존 데이터에 새로운 페이지 데이터 이어 붙이기
    setPageParams((prev) => [...prev, page]); // 호출한 페이지 번호 저장
    setHasNextPage(!isEnd); // 다음 페이지 유무 상태 설정
    setLoading(false); // 데이터 페칭 및 처리 완료, 로딩 상태 종료
  };

  // page 바뀔 때마다 fetchProducts 함수 호출
  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <>
      {/* 아이템 */}
      {/* 로딩 UI */}
    </>
  );
};

export default App;
