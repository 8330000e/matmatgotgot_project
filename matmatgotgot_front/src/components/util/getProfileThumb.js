import defaultImg from "@/assets/img/defaultImg.svg";

export const getProfileThumb = (thumb) => {
  if (!thumb) return defaultImg;

  // 이미 http:// 또는 https:// 또는 blob: 로 시작하면 그대로 반환
  if (thumb.startsWith("http://") || thumb.startsWith("https://") || thumb.startsWith("blob:")) {
    return thumb;
  }

  // 순수 파일명만 남은 경우 백엔드 정적 파일 경로 결합
  return `${import.meta.env.VITE_BACKSERVER}/upload/${thumb}`;
};