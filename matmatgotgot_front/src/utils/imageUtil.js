export const getProfileImageUrl = (thumb, defaultImg) => {
  // ⭕ 1. thumb가 null, undefined, 빈 문자열("")이거나 string 타입이 아닌 경우 즉시 defaultImg 반환
  if (!thumb || typeof thumb !== "string") {
    return defaultImg || null;
  }

  // ⭕ 2. 카카오/네이버 등 외부 HTTP/HTTPS 프로필 URL인 경우 그대로 반환
  if (thumb.startsWith("http://") || thumb.startsWith("https://")) {
    return thumb;
  }

  // ⭕ 3. string 타입임이 확실할 때만 안전하게 slice 실행
  const cleanPath = thumb.startsWith("/") ? thumb.slice(1) : thumb;
  return `https://d2lg74d5mqmhqe.cloudfront.net/app/upload/web/matgot/menu/${cleanPath}`;
};

// 게시판 등 다른 컴포넌트 호환용
export const getProfileThumb = getProfileImageUrl;