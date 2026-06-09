import styles from "./CardTemp.module.css";

const CardTemp = ({ item }) => {
  const isFullUrl = item.imgName?.startsWith("http");
  const imgSrc = isFullUrl
    ? item.imgName
    : `${import.meta.env.VITE_BACKSERVER}/menu/${item.imgName || "default_rest.png"}`;

  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        <img
          src={imgSrc}
          alt={item.title || "식당 이미지"}
          className={styles.image}
        />
      </div>

      <div className={styles.infoBox}>
        {item.restAddr && (
          <span className={styles.addressText} title={item.restAddr}>
            {item.restAddr.split(" ")[0]}{" "}
            {item.restAddr.split(" ")[1] || ""}{" "}
          </span>
        )}

        <h3 className={styles.title}>{item.title}</h3>

        <div className={styles.divider}></div>

        <p className={styles.description}>{item.desc}</p>
      </div>
    </div>
  );
};

export default CardTemp;
