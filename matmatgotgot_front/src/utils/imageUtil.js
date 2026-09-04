import defaultImg from "../assets/img/defaultImg.svg";

export const getProfileImageUrl = (thumb, defaultImg) => {
  // ⭕ 1. thumb가 null, undefined, 비어있는 문자열, 혹은 string 타입이 아닌 경우 기본 이미지 반환
  if (!thumb || typeof thumb !== "string") {
    return defaultImg || null;
  }

  // ⭕ 2. 소셜 로그인 등 외부 HTTP/HTTPS URL인 경우 그대로 반환
  if (thumb.startsWith("http://") || thumb.startsWith("https://")) {
    return thumb;
  }

  // ⭕ 3. 안전하게 슬래시(/) 제거 후 CloudFront S3 경로 결합
  const cleanPath = thumb.startsWith("/") ? thumb.slice(1) : thumb;
  return `https://d2lg74d5mqmhqe.cloudfront.net/app/upload/web/matgot/menu/${cleanPath}`;
};