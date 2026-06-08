import styles from "./CardTemp.module.css";

const CardTemp = ({ item }) => {
  const isFullUrl = item.imgName?.startsWith("http");
  const imgSrc = isFullUrl
    ? item.imgName
    : `${import.meta.env.VITE_BACKSERVER}/menu/${item.imgName || "default_rest.png"}`;

  return (
    <div className={styles.card}>
      {/* 1. 이미지 영역 */}
      <div className={styles.imageBox}>
        <img
          src={imgSrc}
          alt={item.title || "식당 이미지"}
          className={styles.image}
        />
      </div>

      {/* 2. 정보 콘텐츠 영역 */}
      <div className={styles.infoBox}>
        {/* 상단에 주소/위치를 작게 얹어 시선 분산 방지 */}
        {item.restAddr && (
          <span className={styles.addressText} title={item.restAddr}>
            {item.restAddr.split(" ")[0]} {item.restAddr.split(" ")[1] || ""}{" "}
            {/* 예: '서울 강남구' 까지만 깔끔하게 출력 */}
          </span>
        )}

        {/* 주인공인 식당명은 한 줄을 온전히 크게 차지 */}
        <h3 className={styles.title}>{item.title}</h3>

        {/* 얇은 에센셜 라인 */}
        <div className={styles.divider}></div>

        {/* 맛집 설명글 */}
        <p className={styles.description}>{item.desc}</p>
      </div>
    </div>
  );
};

export default CardTemp;
