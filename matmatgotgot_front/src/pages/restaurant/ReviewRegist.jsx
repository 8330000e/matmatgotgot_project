import { useState } from "react";
import styles from "./ReviewRegist.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import ClearIcon from "@mui/icons-material/Clear";

const ReviewRegist = () => {
  // 폼 필드 상태
  const [review, setReview] = useState({
    restName: "",
    restAddr: "",
    reviewMenu: "",
    reviewVisit: "",
    reviewContent: "",
  });

  // 별점 상태 (1~5, 0 = 미선택)
  const [rating, setRating] = useState(0);

  // 체크된 태그 배열
  const [tags, setTags] = useState([]);

  // 첨부 이미지 파일 배열
  const [files, setFiles] = useState([]);

  // 이미지 추가
  const addFiles = (fileList) => {
    setFiles([...files, ...fileList]);
  };

  // 이미지 삭제
  const deleteFile = (targetFile) => {
    setFiles(files.filter((f) => f !== targetFile));
  };

  // 입력 공통 핸들러
  const inputReview = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  // 태그 체크박스 핸들러
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTags([...tags, value]);
    } else {
      setTags(tags.filter((item) => item !== value));
    }
  };

  // 리뷰 등록
  const registReview = () => {
    // 필수 항목 검증
    if (
      !review.restName.trim() ||
      !review.restAddr.trim() ||
      !review.reviewMenu.trim() ||
      !review.reviewVisit.trim() ||
      !review.reviewContent.trim() ||
      rating === 0
    ) {
      Swal.fire({ title: "모든 항목을 입력해주세요", icon: "warning" });
      return;
    }

    // 파일 포함 요청 → FormData 사용
    const form = new FormData();
    form.append("memberNo", 1);
    form.append("restNo", 1);
    form.append("restName", review.restName);
    form.append("restAddr", review.restAddr);
    form.append("reviewMenu", review.reviewMenu);
    form.append("reviewVisit", review.reviewVisit);
    form.append("reviewContent", review.reviewContent);
    form.append("rating", rating);
    tags.forEach((tag) => form.append("tags", tag));
    files.forEach((file) => form.append("files", file));

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/restaurants/review`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data > 0) {
          Swal.fire({ title: "리뷰 작성 완료", icon: "success" }).then(
            () => {},
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const tagList = [
    { value: "outdoor", label: "야외석" },
    { value: "soup", label: "국물" },
    { value: "vibe", label: "분위기" },
    { value: "alone", label: "혼밥" },
    { value: "date", label: "데이트" },
  ];

  return (
    <div className={styles.page_wrap}>
      {/* ── 페이지 제목 ── */}
      <h2 className={styles.page_title}>리뷰 작성</h2>

      <section className={styles.regist_main}>
        {/* ======= 왼쪽: 폼 필드 ======= */}
        <div className={styles.main_left}>
          {/* 상호명 */}
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="restName">
              상호명*
            </label>
            <input
              type="text"
              name="restName"
              id="restName"
              value={review.restName}
              onChange={inputReview}
            />
          </div>

          {/* 주소 */}
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="restAddr">
              주소*
            </label>
            <input
              type="text"
              name="restAddr"
              id="restAddr"
              value={review.restAddr}
              onChange={inputReview}
            />
          </div>

          {/* 메뉴 */}
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="reviewMenu">
              메뉴*
            </label>
            <input
              type="text"
              name="reviewMenu"
              id="reviewMenu"
              value={review.reviewMenu}
              onChange={inputReview}
            />
          </div>

          {/* 방문 날짜 */}
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="reviewVisit">
              방문 날짜*
            </label>
            <input
              type="date"
              name="reviewVisit"
              id="reviewVisit"
              value={review.reviewVisit}
              onChange={inputReview}
            />
          </div>

          {/* ── 별점 ── */}
          <div className={styles.star_rating}>
            <div className={styles.field_label}>별점*</div>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="large"
              sx={{
                color: "var(--primary)", // 선택된 별 — 노란색
                "& .MuiRating-iconEmpty": {
                  color: "var(--gray5)", // 미선택 별 — 회색
                },
              }}
            />
          </div>

          {/* ── 태그 선택 ── */}
          <div className={styles.tag_wrap}>
            <div className={styles.field_label}>태그 선택</div>
            <div className={styles.tag}>
              {tagList.map(({ value, label }) => (
                <label key={value}>
                  <input
                    type="checkbox"
                    value={value}
                    checked={tags.includes(value)}
                    onChange={handleTagChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ======= 오른쪽: 사진 + 리뷰 내용 ======= */}
        <div className={styles.main_right}>
          {/* ── 사진 등록 ── */}
          <div className={styles.field_group}>
            <input
              type="file"
              id="files"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => addFiles(Array.from(e.target.files))}
            />

            {/* 기존 서버 파일 목록 (수정 모드에서 사용) */}
            {review.fileList &&
              review.fileList.map((file, index) => (
                <FileItem key={index} file={file} />
              ))}

            {/* 사진 없을 때: 클릭 영역 */}
            {files.length === 0 ? (
              <label htmlFor="files" className={styles.photo_placeholder}>
                사진 등록
              </label>
            ) : (
              /* 사진 있을 때: 미리보기 그리드 */
              <div className={styles.photo_preview}>
                {files.map((file, index) => (
                  <div key={index} className={styles.preview_item}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`미리보기 ${index + 1}`}
                    />
                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      className={styles.preview_delete}
                      onClick={() => deleteFile(file)}
                    >
                      <ClearIcon sx={{ fontSize: 14 }} />
                    </button>
                  </div>
                ))}
                {/* 추가 업로드 버튼 */}
                <label htmlFor="files" className={styles.photo_add_more}>
                  +
                </label>
              </div>
            )}
          </div>

          {/* ── 리뷰 내용 ── */}
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="reviewContent">
              리뷰 내용*
            </label>
            <textarea
              className={styles.review_textarea}
              name="reviewContent"
              id="reviewContent"
              value={review.reviewContent}
              onChange={inputReview}
              placeholder="리뷰 내용을 입력하세요"
            />
          </div>

          {/* ── 등록 버튼 ── */}
          <div className={styles.btn_zone}>
            <button
              type="button"
              className={styles.regist_btn}
              onClick={registReview}
            >
              리뷰 등록
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const FileItem = ({ file, deleteFile }) => {
  return (
    <ul className={styles.file_item}>
      <li className={styles.file_name}>{file.name || file.reviewFileName}</li>
      {deleteFile && (
        <li>
          <ClearIcon
            className={styles.file_delete}
            onClick={() => deleteFile(file)}
          />
        </li>
      )}
    </ul>
  );
};

export default ReviewRegist;
