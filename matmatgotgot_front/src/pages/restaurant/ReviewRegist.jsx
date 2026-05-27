import { useState } from "react";
import styles from "./ReviewRegist.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ReviewRegist = () => {
  const [review, setReview] = useState({
    restName: "",
    restAddr: "",
    reviewMenu: "",
    reviewVisit: "",
    reviewContent: "",
  });
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);

  const addFiles = (fileList) => {
    const newFiles = [...files, ...fileList];
    setFiles(newFiles);
  };

  const deleteFile = (file) => {
    const newFiles = files.filter((item) => {
      return item !== file;
    });
    setFiles(newFiles);
  };

  const inputReview = (e) => {
    const newReview = { ...review, [e.target.name]: e.target.value };
    setReview(newReview);
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTags([...tags, value]);
    } else {
      setTags(tags.filter((item) => item !== value));
    }
  };

  const registReview = () => {
    if (
      review.restName === "" ||
      review.restAddr === "" ||
      review.reviewMenu === "" ||
      review.reviewVisit === "" ||
      review.reviewContent === ""
    ) {
      return;
    }

    // 파일을 포함한 요청을 서버에 보낼 때
    // -> FormData 겍체를 사용해야 한다
    const form = new FormData();
    form.append("restName", review.restName);
    form.append("restAddr", review.restAddr);
    form.append("reviewMenu", review.reviewMenu);
    form.append("reviewVisit", review.reviewVisit);
    form.append("reviewContent", review.reviewContent);
    files.forEach((file) => {
      form.append("files", file);
    });

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/review`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data > 0) {
          Swal.fire({ title: "게시글 작성 완료", icon: "success" }).then(() => {
            navigate("/board/list");
          });
        }
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //죄송합니다. 화면을 보기위해 여러부분에 주석처리를 했고 쌩뚱맞은곳에 변수나 함수를 입력해두었습니다ㅜㅜ
  registReview

  return (
    <>
      <div>리뷰 작성</div>
      <section className={styles.regist_main}>
        <div className={styles.main_left}>
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

          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="reviewVisit">
              방문 날짜*
            </label>
            <input
              type="text"
              name="reviewVisit"
              id="reviewVisit"
              // value={reviewVisit}
              // onChange={(e) => setRestPhone(e.target.value)}
            />
          </div>

          <div className={styles.star_rating}>
            <div>별점*</div>
          </div>

          <div className={styles.tsg_wrap}>
            <div className={styles.field_label}>태그 선택</div>
            <div className={styles.tag}>
              <label>
                <input
                  type="checkbox"
                  value="outdoor"
                  checked={tags.includes("outdoor")}
                  onChange={handleTagChange}
                />
                야외석
              </label>
              <label>
                <input
                  type="checkbox"
                  value="soup"
                  checked={tags.includes("soup")}
                  onChange={handleTagChange}
                />
                국물
              </label>
              <label>
                <input
                  type="checkbox"
                  value="vibe"
                  checked={tags.includes("vibe")}
                  onChange={handleTagChange}
                />
                분위기
              </label>
              <label>
                <input
                  type="checkbox"
                  value="alone"
                  checked={tags.includes("alone")}
                  onChange={handleTagChange}
                />
                혼밥
              </label>
              <label>
                <input
                  type="checkbox"
                  value="date"
                  checked={tags.includes("date")}
                  onChange={handleTagChange}
                />
                데이트
              </label>
            </div>
          </div>
        </div>

        <div className={styles.main_right}>
          <div className={styles.file_wrap}>
            <label htmlFor="files">첨부파일</label>
            <label htmlFor="files" className={styles.file_btn}>
              파일추가
            </label>
            <input
              type="file"
              id="files"
              onChange={(e) => {
                // e.target.files -> 선택한 파일들을 FileList객체로 반환 (배열과 유사하지만 배열은 아님)
                // -> 배열로 변환해서 사용
                const fileList = Array.from(e.target.files);
                addFiles(fileList);
              }}
              multiple
              style={{ display: "none" }}
            ></input>
            <div className={styles.file_wrap}>
              {/* 리뷰 수정 시 사용 */}
              {review.fileList &&
                review.fileList.map((file, index) => {
                  return (
                    <FileItem
                      key={index}
                      file={file}
                      // deleteFile={addDeleteFileList}
                    ></FileItem>
                  );
                })}
              {files.map((file, index) => {
                return (
                  <FileItem
                    key={index}
                    file={file}
                    deleteFile={deleteFile}
                  ></FileItem>
                );
              })}
            </div>
          </div>
          <div className={styles.textarea_wrap}>
            <textarea
              className={styles.textarea}
              name="reviewContent"
              id="reviewContent"
              value={review.reviewContent}
              onChange={inputReview}
            ></textarea>
          </div>
        </div>
      </section>
      <div className={styles.btn_zone}>
        <button type="button">리뷰 등록*</button>
      </div>
    </>
  );
};

const FileItem = ({ file, deleteFile }) => {
  return (
    <ul className={styles.file_item}>
      <li>
        {/* <InsertDriveFileIcon /> */}
      </li>
      <li className={styles.file_name}>{file.name || file.reviewFileName}</li>
      <li>
        {/* <ClearIcon
          className={styles.file_delete}
          onClick={() => {
            deleteFile(file);
          }}
        /> */}
        {deleteFile}
      </li>
    </ul>
  );
};

export default ReviewRegist;
