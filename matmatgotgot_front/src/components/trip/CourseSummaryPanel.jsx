import styles from "./CourseSummaryPanel.module.css";

const CourseSummaryPanel = ({
  courseTitle,
  setCourseTitle,
  courseDesc,
  onCourseDescChange, // 부모에서 전달받은 300자 제한 전용 핸들러
  travelDays,
  onTravelDaysChange,
  tags,
  onTagToggle,
  hours,
  mins,
  totalDistance,
  totalCost,
  onSubmit,
}) => {
  const handleTagClick = (tag) => {
    if (tag.active) {
      onTagToggle(tag.id);
      return;
    }
    const activeCount = tags.filter((t) => t.active).length;
    if (activeCount >= 5) {
      alert("카테고리 태그는 최대 5개까지만 선택할 수 있습니다.");
      return;
    }
    onTagToggle(tag.id);
  };

  return (
    <div className={styles.metaConfigPanel}>
      {/* 1. 코스명 입력 */}
      <div className={styles.inputGroup}>
        <label>코스명</label>
        <input
          type="text"
          placeholder="여기에 써보아요~"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
        />
      </div>

      {/* 2. 코스 설명 입력 영역 (300자 카운터 탑재) */}
      <div className={styles.inputGroup} style={{ position: "relative" }}>
        <label>코스 설명</label>
        <textarea
          placeholder="코스에 대한 설명을 입력해주세요 (최대 300자)"
          value={courseDesc}
          onChange={(e) => onCourseDescChange(e.target.value)}
          className={styles.courseTextArea}
          maxLength={300}
        />
        <div className={styles.charCounter}>{courseDesc.length} / 300</div>
      </div>

      {/* 3. 여행 기간 */}
      <div className={styles.inputGroup}>
        <label>여행 기간</label>
        <select
          value={travelDays}
          onChange={(e) => onTravelDaysChange(e.target.value)}
          className={styles.durationSelect}
        >
          <option value={1}>당일치기</option>
          <option value={2}>1박 2일 (2Days)</option>
          <option value={3}>2박 3일 (3Days)</option>
          <option value={4}>3박 4일 (4Days)</option>
          <option value={5}>4박 5일 (5Days)</option>
        </select>
      </div>

      {/* 4. 카테고리 태그 설정 */}
      <div className={styles.tagGroupWrap}>
        <label>카테고리 설정</label>
        <div className={styles.tagGrid}>
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={`${styles.metaTag} ${tag.active ? styles.tagActive : ""}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag.text}
            </span>
          ))}
        </div>
      </div>

      {/* 5. 대시보드 및 제출 */}
      <div className={styles.summaryDashboard}>
        <div className={styles.summaryLine}>
          <span>총 소요 시간 (전체)</span>
          <strong>
            {hours > 0 ? `약 ${hours}시간 ${mins}분` : `약 ${mins}분`}
          </strong>
        </div>
        <div className={styles.summaryLine}>
          <span>총 이동 거리 (전체)</span>
          <strong>약 {totalDistance}km</strong>
        </div>
        <div className={styles.summaryLine}>
          <span>총 비용 (전체)</span>
          <strong>약 {totalCost.toLocaleString()}원</strong>
        </div>
      </div>

      <div className={styles.submitRow}>
        <button className={styles.registerBtn} onClick={onSubmit}>
          등록하기 →
        </button>
      </div>
    </div>
  );
};

export default CourseSummaryPanel;
