import defaultImg from "../assets/img/defaultImg.svg";

export const getProfileImageUrl = (thumb, defaultImg) => {
  // ⭕ thumb가 null, undefined, 빈 문자열이거나 string 타입이 아닌 경우 즉시 defaultImg 반환
  if (!thumb || typeof thumb !== "string") {
    return defaultImg || null;
  }

  // 소셜 로그인 등 HTTP/HTTPS 외부 경로
  if (thumb.startsWith("http://") || thumb.startsWith("https://")) {
    return thumb;
  }

  // 문자열임이 보장된 상태에서 안전하게 slice 실행
  const cleanPath = thumb.startsWith("/") ? thumb.slice(1) : thumb;
  return `https://d2lg74d5mqmhqe.cloudfront.net/app/upload/web/matgot/menu/${cleanPath}`;
};

export const getProfileThumb = getProfileImageUrl;