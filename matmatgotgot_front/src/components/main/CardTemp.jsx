import styles from "./CardTemp.module.css";

const CardTemp = ({ item }) => {
  const imgSrc = new URL(
    `../../assets/restaurant/${item.imgName}`,
    import.meta.url,
  ).href;

  const desc =
    item.desc.length > 47 ? item.desc.slice(0, 47) + " ..." : item.desc;

  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        <img src={imgSrc} alt="식당 이미지" className={styles.image} />
      </div>

      <div className={styles.infoBox}>
        <div className={styles.title}>{item.title}</div>
        <div className={styles.description}>{desc}</div>
      </div>
    </div>
  );
};

export default CardTemp;
