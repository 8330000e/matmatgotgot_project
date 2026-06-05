package com.twotwo.matmatgotgot.domain.restaurant.service;

import com.twotwo.matmatgotgot.domain.restaurant.dto.request.*;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.*;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Coords;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Recommand;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Restaurant;
import com.twotwo.matmatgotgot.domain.restaurant.mapper.RestaurantMapper;
import com.twotwo.matmatgotgot.global.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantMapper restaurantMapper;
    private final FileUtil fileUtil;

    @Value("${file.root}")
    private String root;

    @Transactional
    public int restaurantCreate(Restaurant restaurant) {
        return restaurantMapper.restaurantCreate(restaurant);
    }//


    public RestViewResponse restaurantViewInfo(String memberId, Long restNo) {
        RestViewResponse restRes = restaurantMapper.restaurantViewInfo(memberId, restNo);
        List<String> tags = restaurantMapper.getTags(restNo);
        List<String> menus = restaurantMapper.getMenus(restNo);

        restRes.setTags(tags);
        restRes.setMenus(menus);

        return restRes;
    }//

    public List<RestReviewsResponse> restaurantViewReviews(RestViewReviewsRequest request) {
        List<RestReviewsResponse> reviewResList = restaurantMapper.restaurantViewReviews(request);

        for (RestReviewsResponse restReviewsResponse : reviewResList) {
            List<String> menus = restaurantMapper.getMenusByReviewNo(restReviewsResponse.getReviewNo());
            restReviewsResponse.setMenus(menus);
        }

        return reviewResList;
    }//

    public int restaurantViewReviewsCnt(RestViewReviewsRequest request) {
        return restaurantMapper.restaurantViewReviewsCnt(request);
    }//

    @Transactional
    public boolean reviewCreate(ReviewCreateRequest request) {
        int res1 = restaurantMapper.reviewInsert(request);
        if (res1 != 1) {
            throw new RuntimeException("리뷰 저장 실패");
        }

        if (request.getReviewMenus() != null && !request.getReviewMenus().isEmpty()) {
            int res2 = restaurantMapper.insertReviewMenus(request.getReviewNo(), request.getReviewMenus());
            if (res2 != request.getReviewMenus().size()) {
                throw new RuntimeException("메뉴 저장 실패");
            }
        }

        if (request.getTags() != null && !request.getTags().isEmpty()) {
            int res3 = restaurantMapper.insertReviewTags(request.getReviewNo(), request.getTags());
            if (res3 != request.getTags().size()) {
                throw new RuntimeException("태그 저장 실패");
            }
        }

        if (request.getFiles() != null && !request.getFiles().isEmpty()) {
            String savepath = root + "restaurant/";
            File dir = new File(savepath);  // 디렉토리 없으면 생성
            if (!dir.exists()) {
                dir.mkdirs();
            }

            List<String> imageUrls = new ArrayList<>();

            for (MultipartFile file : request.getFiles()) {
                if (file.isEmpty()) continue;

                String savedFileName = fileUtil.upload(savepath, file); // UUID 파일명 반환
                imageUrls.add(savedFileName);
            }

            if (!imageUrls.isEmpty()) {
                int res4 = restaurantMapper.insertReviewImages(request.getReviewNo(), imageUrls);
                if (res4 != imageUrls.size()) {
                    throw new RuntimeException("이미지 저장 실패");
                }
            }
        }

        // 레이팅, 리뷰수 증가
        int res5 = restaurantMapper.increaseRatingAvg(request.getRestNo(), request.getRating());
        if (res5 != 1) {
            throw new RuntimeException("레이팅, 리뷰수 증가 실패");
        }

        return true;
    }//

    public ReviewViewResponse getReviewView(Long reviewNo) {
        ReviewViewResponse res = restaurantMapper.getReviewView(reviewNo);
        List<String> images = restaurantMapper.getReviewImages(reviewNo);
        List<String> menu = restaurantMapper.getReviewMenu(reviewNo);
        List<String> tags = restaurantMapper.getReviewTags(reviewNo);

        res.setImages(images);
        res.setReviewMenu(menu);
        res.setTags(tags);

        return res;
    }//

    // 댓글/대댓글 목록 조회
    // depth=0(댓글), depth=1(대댓글) 를 flat list 로 반환
    public List<ReviewCommentResponse> commentList(Long reviewNo) {
        return restaurantMapper.selectCommentList(reviewNo);
    }//

    // 댓글/대댓글 등록
    // 등록 후 생성된 댓글을 단건 조회해서 반환 (프론트 로컬 상태에 바로 추가)
    @Transactional
    public ReviewCommentResponse commentRegist(Long reviewNo, ReviewCommentRequest request) {
        int result = restaurantMapper.insertComment(reviewNo, request);

        if (result != 1) {
            throw new RuntimeException("댓글 저장 실패");
        }

        return restaurantMapper.selectComment(request.getCommentNo());
    }//

    // 댓글/대댓글 내용 수정
    @Transactional
    public void commentUpdate(Long commentNo, String content) {
        int result = restaurantMapper.updateComment(commentNo, content);

        if (result != 1) {
            throw new RuntimeException("댓글 수정 실패");
        }
    }//

    // 댓글/대댓글 삭제
    @Transactional
    public void commentDelete(Long commentNo) {
        int result = restaurantMapper.deleteComment(commentNo);

        if (result < 1) {
            throw new RuntimeException("댓글 삭제 실패");
        }
    }//

    public List<Recommand> getPopular(String memberId) {
        return restaurantMapper.getPopular(memberId);
    }//

    public List<Recommand> getLike(String memberId) {
        return restaurantMapper.getLike(memberId);
    }//

    public List<Recommand> getRegion(String memberId, Coords coords) {
        return restaurantMapper.getRegion(memberId, coords);
    }//

    public List<Recommand> getMainList(MainListRequest req, String memberId) {
        return restaurantMapper.getMainList(req, memberId);
    }//

    public int getMainListCount(MainListRequest req, String memberId) {
       return restaurantMapper.getMainListCount(req, memberId);
    }//

    public CheckDuplicationResponse isDup(CheckDuplicationRequest chk) {
        Long restNo = restaurantMapper.getSame(chk);

        return CheckDuplicationResponse.builder()
                .duplicate(restNo != null)
                .restNo(restNo)
                .build();
    }//
}
