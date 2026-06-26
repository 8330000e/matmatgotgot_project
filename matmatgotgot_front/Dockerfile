# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# 빌드 시 .env 값을 ARG로 주입
ARG VITE_BACKSERVER
ARG VITE_NAVER_MAP_KEY
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_KAKAO_JAVASCRIPT_KEY
ARG VITE_KAKAO_REST_API_KEY
ARG VITE_KAKAO_REDIRECT_URI
ARG VITE_KAKAO_CLIENT_SECRET
ARG VITE_NAVER_CLIENT_ID
ARG VITE_NAVER_CLIENT_SECRET
ARG VITE_IMG_SERVER
ARG VITE_TMAP_APP_KEY
ARG VITE_ODSAY_API_KEY

RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

