# matmatgotgot_project

> Backend: Java 17 + Spring Boot + MyBatis + MySQL
> Frontend: React (Vite)
> Infra: Docker + AWS(EC2, RDS, S3, CloudFront, ECR) + GitHub Actions CI/CD

```
matmatgotgot_project/
├── backend/                  # Spring Boot (Java 17, Gradle, MyBatis)
├── frontend/                 # React + Vite
├── mysql/
│   └── init.sql              # DB 초기 데이터
├── docker-compose.yml        # backend + frontend 컨테이너 오케스트레이션
├── .github/workflows/deploy.yml   # ECR push → EC2 배포 → CloudFront 캐시 무효화
├── .env                      # DB/JWT/AWS 등 환경변수 (git 미포함)
└── README.md
```

---

## 1. backend/

도메인 기반 패키지 구조, MyBatis 사용 (Repository 계층 없이 `Controller → Service → Mapper`).

```
backend/
├── Dockerfile                # multi-stage build (gradle build → jre-alpine run)
├── build.gradle / settings.gradle / gradle.properties
├── gradlew, gradlew.bat, gradle/wrapper/
└── src/
    ├── main/
    │   ├── java/com/twotwo/matmatgotgot/
    │   │   ├── MatmatgotgotApplication.java
    │   │   │
    │   │   ├── domain/                     # 도메인별 수직 분리
    │   │   │   ├── admin/
    │   │   │   │   ├── controller/  AdminController
    │   │   │   │   ├── entity/      AdminListItem, AdminListResponse, AdminProcessRequest
    │   │   │   │   ├── mapper/      AdminMapper
    │   │   │   │   └── service/     AdminService
    │   │   │   │
    │   │   │   ├── board/
    │   │   │   │   ├── controller/  BoardController, NaverController
    │   │   │   │   ├── entity/      Board, BoardComment, ListItem, ListResponse
    │   │   │   │   ├── mapper/      BoardMapper
    │   │   │   │   └── service/     BoardService
    │   │   │   │
    │   │   │   ├── main/
    │   │   │   │   ├── controller/  MainController
    │   │   │   │   ├── dto/response/  MainBestReviewDTO, MainBestTourDTO
    │   │   │   │   ├── mapper/      MainMapper
    │   │   │   │   └── service/     MainService
    │   │   │   │
    │   │   │   ├── member/
    │   │   │   │   ├── controller/  MemberController
    │   │   │   │   ├── dto/         LoginResponseDto, MemberLoginDto, tokenDto
    │   │   │   │   │   ├── request/   MemberCreateRequest, MemberLoginRequest, MemberUpdateRequest
    │   │   │   │   │   └── response/  MemberResponse
    │   │   │   │   ├── entity/      BaseEntity, LoginMember, Member, Natives
    │   │   │   │   ├── mapper/      MemberMapper
    │   │   │   │   └── service/     MemberService
    │   │   │   │
    │   │   │   ├── receiptocr/
    │   │   │   │   ├── config/      ClovaOcrProperties
    │   │   │   │   ├── controller/  OcrController
    │   │   │   │   ├── dto/         MenuItem, OCRApiResponse, ReceiptData
    │   │   │   │   └── service/     ClovaOcrApiService, OcrService, ReceiptParserService
    │   │   │   │
    │   │   │   ├── restaurant/
    │   │   │   │   ├── controller/  RestaurantController
    │   │   │   │   ├── dto/request/   CheckDuplicationRequest, MainListRequest, ReportRequest,
    │   │   │   │   │                  RestCreateRequest, RestViewReviewsRequest,
    │   │   │   │   │                  ReviewCommentRequest, ReviewCommentUpdateRequest,
    │   │   │   │   │                  ReviewCreateRequest, SearchRequest
    │   │   │   │   ├── dto/response/  CheckDuplicationResponse, RestReviewsResponse, RestViewResponse,
    │   │   │   │   │                  RestaurantMapMarkerDTO, RestaurantResponseDTO,
    │   │   │   │   │                  ReviewCommentResponse, ReviewCreateResponse, ReviewViewResponse
    │   │   │   │   ├── entity/      Coords, Recommand, RestStatus, Restaurant
    │   │   │   │   ├── mapper/      RestaurantMapper
    │   │   │   │   └── service/     RestaurantService
    │   │   │   │
    │   │   │   └── trip/
    │   │   │       ├── controller/  TripController
    │   │   │       ├── dto/request/   FavoriteCountRequest, FavoriteRequest, MenuInsertRequest,
    │   │   │       │                  TripCreateRequestDTO, TripUpdateDTO
    │   │   │       ├── dto/response/  CourseDetailResponse, MenuDTO, MyUnfinishedCourseDTO,
    │   │   │       │                  RawSchedule, RestaurantDTO, RouteNodeDTO, TagDTO,
    │   │   │       │                  TravelPlanDTO, TripCourseResponse
    │   │   │       ├── mapper/      TripMapper
    │   │   │       └── service/     TripService
    │   │   │
    │   │   ├── global/                     # 도메인 공통
    │   │   │   ├── config/           MyBatisConfig, S3Config, WebConfig
    │   │   │   ├── exception/        BusinessException, DuplicateEmailException, ErrorCode,
    │   │   │   │                     GlobalExceptionHandler, MemberNotFoundException, OcrExceptions
    │   │   │   ├── response/         ApiResponse
    │   │   │   └── util/             DateUtils, EmailSender, FileUtil, MailConfig, S3FileUtil, StringUtils
    │   │   │
    │   │   └── security/                   # 인증/인가
    │   │       ├── CustomUserDetailsService
    │   │       ├── GoogleOAuthService, GoogleUserProfile
    │   │       ├── JwtAuthFilter, JwtTokenProvider
    │   │       └── SpringSecurityConfig
    │   │
    │   └── resources/
    │       ├── application.properties
    │       ├── application-secret.properties
    │       ├── mapper/                     # MyBatis XML (도메인별)
    │       │   ├── AdminMapper.xml, BoardMapper.xml, MainMapper.xml, MemberMapper.xml
    │       │   ├── restaurant/RestaurantMapper.xml
    │       │   └── trip/TripMapper.xml
    │       └── templates/                  # 이메일 템플릿
    │           ├── joinEmail.html
    │           └── matmatgotgotLogo.png
    │
    └── test/java/com/twotwo/matmatgotgot/
        └── MatmatgotgotApplicationTests.java
```

## 2. frontend/

```
frontend/
├── Dockerfile                # multi-stage build (node build → nginx serve)
├── nginx.conf                # React Router + /api 프록시
├── vite.config.js
├── index.html
├── package.json / package-lock.json
├── .env / .env.example
└── src/
    ├── main.jsx, App.jsx, App.css, index.css
    │
    ├── api/                  # Axios 통신
    │   ├── index.js, memberApi.js, routeApi.js
    │
    ├── store/                # 전역 상태
    │   └── useAuthStore.js   # JWT 인증 상태
    │
    ├── components/           # 도메인별 재사용 컴포넌트
    │   ├── board/       BoardFrm, BoardList, NaverMap
    │   ├── commons/     Header, Footer
    │   ├── main/        CardTemp, HorizontalFadeScroll, MyCourse, Slide
    │   ├── member/      BoardLikeList, BoardList, BoardReports
    │   ├── restaurant/  RestSlide, RestaruntViewInfo, RestaruntViewReviews,
    │   │                RestaurantItem, ReviewCommentItem, ReviewViewComment,
    │   │                ReviewViewInfo, SpecifyCurLocationModal
    │   ├── trip/        AddMenuModal, CourseCollect, CourseMap, CourseRouteMap,
    │   │                CourseSummaryPanel, ListFrame, RestaurantSearch, SelectedCourseList
    │   └── ui/          BoardTextEditor, Button, Form, Pagination, ReportModal, TextEditor
    │
    ├── pages/                # 라우트 단위 페이지
    │   ├── admin/       AdminPage
    │   ├── board/       BoardListPage, BoardModifyPage, BoardViewPage, BoardWritePage,
    │   │                BoardAddress, NaverSearch
    │   ├── else/        Faq, Inquiry, LocationTerms, Notice, Privacy, Terms
    │   ├── main/        Main, Main_login
    │   ├── member/      Finding, JoinPage, LoginPage, MypagePage, NaverCallbackPage
    │   ├── restaurant/  ReceiptCheck, RestaurantDetailSearch, RestaurantMain,
    │   │                RestaurantModify, RestaurantRegist, RestaurantView,
    │   │                ReviewModify, ReviewRegist, ReviewView
    │   └── trip/        CourseDetail, CreateCourse, EditCourse, TripMain
    │
    ├── assets/               # 정적 리소스 (이미지/아이콘)
    │   ├── logo/, main/, board/, restaurant/, img/  (svg, png)
    │
    └── public/
        └── favicon.svg
```

## 3. mysql/

```
mysql/
└── init.sql   # DB 스키마 생성 + 샘플 데이터
```

## 4. 배포/인프라

```
docker-compose.yml
├── backend   → ECR 이미지, 9999 포트, RDS 연결 env 주입
└── frontend  → ECR 이미지, 80 포트, backend에 depends_on

.github/workflows/deploy.yml
├── build-and-push : backend/frontend Docker 이미지 빌드 → ECR push
└── deploy         : EC2 SSH 접속 → docker compose pull/up → CloudFront 캐시 무효화
```
