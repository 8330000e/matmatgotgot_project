import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./ReceiptCheck.module.css";
import axios from "axios";

// ── 가격 포맷 헬퍼 (컴포넌트 외부 — ResultCard/ReceiptCheck 공용) ──
// 숫자 또는 문자열 → "N,NNN원" 형식 반환 / 값 없으면 null
const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num =
    typeof value === "string" ? value.replace(/[^0-9]/g, "") : String(value);
  if (!num) return null;
  return Number(num).toLocaleString("ko-KR") + "원";
};

/* ============================================================
   ReceiptCheck — 메인 컴포넌트
   ============================================================ */
const ReceiptCheck = () => {
  const [file, setFile] = useState(null); // 선택된 파일
  const [preview, setPreview] = useState(null); // 이미지 미리보기 URL
  const [loading, setLoading] = useState(false); // OCR 분석 중 여부
  const [result, setResult] = useState(null); // OCR 결과 데이터
  const [error, setError] = useState(null); // 에러 메시지
  const [dragOver, setDragOver] = useState(false); // 드래그 오버 여부

  const inputRef = useRef(null); // 숨겨진 file input 참조

  // ── 파일 선택 공통 처리 (input change / 드래그 드롭) ──────
  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    // 이미지 파일만 허용
    if (!selectedFile.type.startsWith("image/")) {
      setError("이미지 파일(JPG, PNG, GIF 등)만 업로드할 수 있습니다.");
      return;
    }

    // 20MB 크기 제한
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError("파일 크기는 20MB 이하여야 합니다.");
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setError(null);

    // FileReader로 이미지 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  }, []);

  // ── input[type=file] change 이벤트 ─────────────────────────
  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  // ── 드래그 이벤트 핸들러 ───────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── 이미지 제거 ────────────────────────────────────────────
  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── OCR 분석 API 호출 ──────────────────────────────────────
  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/ocr/receipt",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message || "OCR 분석에 실패했습니다.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "서버 연결에 실패했습니다. 백엔드가 실행 중인지 확인해주세요.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.receipt}>
      <div className={styles.receipt_inner}>
        {/* ── 페이지 헤더 ── */}
        <header className={styles.receipt_header}>
          <h1>영수증 OCR 분석기</h1>
          <p>영수증 이미지를 업로드하면 가게명, 메뉴를 자동으로 추출합니다.</p>
        </header>

        {/* ── 업로드 카드 ── */}
        <div className={styles.upload_card}>
          {/* 드롭존 */}
          <div
            className={`${styles.dropzone} ${dragOver ? styles.dragOver : ""} ${
              preview ? styles.hasImage : ""
            }`}
            onClick={() => !preview && inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* 숨겨진 file input — CSS로 display:none 처리 */}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
            />

            {preview ? (
              /* 이미지 미리보기 */
              <div className={styles.preview_wrapper}>
                <img
                  src={preview}
                  alt="영수증 미리보기"
                  className={styles.preview_image}
                />
                <button
                  className={styles.preview_remove}
                  onClick={handleRemove}
                  title="제거"
                >
                  ✕
                </button>
              </div>
            ) : (
              /* 업로드 안내 */
              <>
                <p className={styles.dropzone_title}>
                  {dragOver
                    ? "여기에 놓으세요!"
                    : "영수증 이미지를 드래그하거나 클릭하세요"}
                </p>
                <p className={styles.dropzone_sub}>JPG, PNG, GIF · 최대 20MB</p>
              </>
            )}
          </div>

          {/* OCR 분석 버튼 */}
          <button
            className={styles.btn_analyze}
            onClick={handleAnalyze}
            disabled={!file || loading}
          >
            {loading ? "분석 중..." : "OCR 분석 시작"}
          </button>

          {/* 로딩 스피너 */}
          {loading && (
            <div className={styles.loading_wrapper}>
              <div className={styles.spinner} />
              <p className={styles.loading_text}>
                CLOVA OCR로 영수증을 분석하고 있습니다...
              </p>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className={styles.error_box}>
              <p className={styles.error_text}>{error}</p>
            </div>
          )}
        </div>

        {/* OCR 결과 카드 */}
        {result && <ResultCard data={result} />}
      </div>
    </div>
  );
};

/* ============================================================
   ResultCard  —  OCR 결과 표시 컴포넌트
   ============================================================ */
const ResultCard = ({ data }) => {
  // 합계 포맷 (있을 때만 표시)
  const totalFormatted = formatPrice(data.totalAmount);

  return (
    <div className={styles.result_card}>
      {/* 결과 헤더 */}
      <div className={styles.result_header}>
        <div className={styles.result_header_title}>OCR 분석 완료</div>
        <div className={styles.result_header_sub}>
          영수증에서 추출된 정보입니다
        </div>
      </div>

      <div className={styles.result_body}>
        {/* 가게명 */}
        <div className={styles.result_row}>
          <div className={styles.result_row_content}>
            <div className={styles.result_label}>가게명</div>
            <div className={styles.result_value}>
              {data.storeName || (
                <span className={styles.no_value}>인식되지 않음</span>
              )}
            </div>
          </div>
        </div>

        {/* 주소 */}
        <div className={styles.result_row}>
          <div className={styles.result_row_content}>
            <div className={styles.result_label}>주소</div>
            <div className={styles.result_value}>
              {data.address || (
                <span className={styles.no_value}>인식되지 않음</span>
              )}
            </div>
          </div>
        </div>

        {/* 날짜 */}
        <div className={styles.result_row}>
          <div className={styles.result_row_content}>
            <div className={styles.result_label}>날짜</div>
            <div className={styles.result_value}>
              {data.date || (
                <span className={styles.no_value}>인식되지 않음</span>
              )}
            </div>
          </div>
        </div>

        {/* 메뉴 목록 */}
        <div className={styles.result_row}>
          <div className={styles.result_row_content}>
            <div className={styles.result_label}>메뉴</div>
            {data.menuItems && data.menuItems.length > 0 ? (
              <ul className={styles.menu_list}>
                {data.menuItems.map((item, idx) => (
                  <li key={idx} className={styles.menu_item}>
                    <span className={styles.menu_item_name}>{item.name}</span>
                    <span className={styles.menu_item_price}>
                      {formatPrice(item.price) || "-"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className={styles.no_value}>인식된 메뉴가 없습니다</span>
            )}
          </div>
        </div>

        {/* 합계 (인식된 경우만 표시) */}
        {totalFormatted && (
          <div className={styles.result_row}>
            <div className={styles.result_row_content}>
              <div className={styles.result_label}>합계</div>
              <div className={`${styles.result_value} ${styles.total_value}`}>
                {totalFormatted}
              </div>
            </div>
          </div>
        )}

        {/* 위치 — 네이버 지도 (주소가 있을 때만 표시) */}
        {data.address && (
          <div className={`${styles.result_row} ${styles.result_row_map}`}>
            <div className={styles.result_row_content}>
              <div className={styles.result_label}>위치</div>
              {/* OCR 주소를 초기값으로 전달 → 지도 자동 이동 */}
              <NaverMapSection initialAddress={data.address} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   NaverMapSection  —  네이버 지도 + 주소 검색
   ============================================================ */
const NaverMapSection = ({ initialAddress }) => {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);

  // initialAddress 로 주소 input 초기화 (수정: 빈 문자열 → OCR 주소)
  const [address, setAddress] = useState(initialAddress || "");
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");

  // ── 지도 초기화 + initialAddress 자동 이동 ──────────────────
  useEffect(() => {
    if (!mapDivRef.current || !window.naver) return;

    const defaultCenter = new naver.maps.LatLng(37.5696734, 126.9843022);

    const map = new naver.maps.Map(mapDivRef.current, {
      center: defaultCenter,
      zoom: 18,
    });

    const marker = new naver.maps.Marker({
      position: defaultCenter,
      map: map,
    });

    const infoWindow = new naver.maps.InfoWindow({
      content: "<h3>KH정보교육원</h3>",
    });

    // ref에 저장 (이후 이벤트/함수에서 참조)
    mapRef.current = map;
    markerRef.current = marker;
    infoWindowRef.current = infoWindow;

    // 마커 클릭 시 InfoWindow 토글
    naver.maps.Event.addListener(marker, "click", () => {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(map, marker);
      }
    });

    // 지도 클릭 시 마커 이동 + 역지오코딩
    naver.maps.Event.addListener(map, "click", (e) => {
      map.setCenter(e.coord);
      marker.setPosition(e.coord);
      if (infoWindow.getMap()) infoWindow.close();

      naver.maps.Service.reverseGeocode(
        { location: e.coord },
        (status, response) => {
          if (status !== naver.maps.Service.Status.OK) {
            alert("주소를 찾을 수 없습니다");
            return;
          }
          const addr = response.result.items[0].address;
          infoWindow.setContent(
            `<div style="padding:8px 12px"><p>${addr}</p></div>`,
          );
          setCoords({ lat: e.coord.lat(), lng: e.coord.lng() });
        },
      );
    });

    // OCR 주소가 있으면 자동으로 지오코딩 후 지도 이동 (수정: 기존에는 미구현)
    if (initialAddress) {
      naver.maps.Service.geocode(
        { query: initialAddress },
        (status, response) => {
          if (status !== naver.maps.Service.Status.OK) return;
          const items = response.v2?.addresses;
          if (!items || items.length === 0) return;

          const { x, y } = items[0];
          const lat = parseFloat(y);
          const lng = parseFloat(x);
          const newCenter = new naver.maps.LatLng(lat, lng);

          map.setCenter(newCenter);
          map.setZoom(18);
          marker.setPosition(newCenter);

          const roadAddr = items[0].roadAddress || items[0].jibunAddress;
          infoWindow.setContent(
            `<div style="padding:8px 12px"><p>${roadAddr}</p></div>`,
          );
          infoWindow.open(map, marker);
          setCoords({ lat, lng });
        },
      );
    }
  }, []); // 마운트 1회 실행 — initialAddress는 마운트 시점에 이미 고정값

  // ── 주소 검색 (검색 버튼 / Enter 키) ───────────────────────
  const handleSearch = () => {
    const query = address.trim();
    if (!query) {
      setError("주소를 입력해주세요.");
      return;
    }
    setError("");

    naver.maps.Service.geocode({ query }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK) {
        setError("주소를 찾을 수 없습니다.");
        return;
      }

      const items = response.v2?.addresses;
      if (!items || items.length === 0) {
        setError("검색 결과가 없습니다.");
        return;
      }

      const { x, y } = items[0];
      const lat = parseFloat(y);
      const lng = parseFloat(x);
      const newCenter = new naver.maps.LatLng(lat, lng);

      mapRef.current.setCenter(newCenter);
      mapRef.current.setZoom(18);
      markerRef.current.setPosition(newCenter);

      if (infoWindowRef.current.getMap()) infoWindowRef.current.close();

      const roadAddr = items[0].roadAddress || items[0].jibunAddress;
      infoWindowRef.current.setContent(
        `<div style="padding:8px 12px"><p>${roadAddr}</p></div>`,
      );
      infoWindowRef.current.open(mapRef.current, markerRef.current);
      setCoords({ lat, lng });
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={styles.api_content_wrap}>
      <h3 className={styles.map_title}>네이버 지도</h3>

      {/* 주소 검색 입력창 */}
      <div className={styles.address_input}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="주소를 입력하세요"
          className={styles.address_input_field}
        />
        <button onClick={handleSearch} className={styles.search_button}>
          검색
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && <p className={styles.map_error}>{error}</p>}

      {/* 선택된 좌표 표시 */}
      {coords && (
        <p className={styles.lat_lng}>
          위도: <strong>{coords.lat.toFixed(7)}</strong>
          &nbsp; 경도: <strong>{coords.lng.toFixed(7)}</strong>
        </p>
      )}

      {/* 지도 컨테이너 */}
      <div className={styles.map_div} ref={mapDivRef} />
    </div>
  );
};

export default ReceiptCheck;
