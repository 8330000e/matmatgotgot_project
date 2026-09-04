import defaultImg from "../assets/img/defaultImg.svg";

// 기존 작성했던 프로필 이미지 처리 함수
export const getProfileImageUrl = (thumb, defaultImg) => {
  if (!thumb || typeof thumb !== "string") {
    return defaultImg || null;
  }
  if (thumb.startsWith("http://") || thumb.startsWith("https://")) {
    return thumb;
  }
  const cleanPath = thumb.startsWith("/") ? thumb.slice(1) : thumb;
  return `https://d2lg74d5mqmhqe.cloudfront.net/app/upload/web/matgot/menu/${cleanPath}`;
};

// ⭕ 게시판 컴포넌트들에서 참조 중인 getProfileThumb 추가 (동일 로직 바인딩)
export const getProfileThumb = getProfileImageUrl;