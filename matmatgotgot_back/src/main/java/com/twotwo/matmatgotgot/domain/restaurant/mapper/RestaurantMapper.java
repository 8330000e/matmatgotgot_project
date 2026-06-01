package com.twotwo.matmatgotgot.domain.restaurant.mapper;

import com.twotwo.matmatgotgot.domain.restaurant.dto.request.RestViewReviewsRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.request.ReviewCommentRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.request.ReviewCreateRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestReviewsResponse;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.RestViewResponse;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.ReviewCommentResponse;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.ReviewViewResponse;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Recommand;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Restaurant;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface RestaurantMapper {

    int restaurantCreate(Restaurant restaurant);

    RestViewResponse restaurantViewInfo(@Param("memberNo") Long memberNo,
                                        @Param("restNo") Long restNo);

    List<String> getTags(Long restNo);

    List<String> getMenus(Long restNo);

    List<RestReviewsResponse> restaurantViewReviews(RestViewReviewsRequest request);

    List<String> getMenusByReviewNo(Long reviewNo);

    int restaurantViewReviewsCnt(RestViewReviewsRequest request);

    int reviewInsert(ReviewCreateRequest request);

    int insertReviewMenus(@Param("reviewNo") Long reviewNo,
                           @Param("menuList") List<String> menuList);

    int insertReviewTags(@Param("reviewNo") Long reviewNo,
                          @Param("tagList") List<String> tagList);

    int insertReviewImages(@Param("reviewNo") Long reviewNo,
                           @Param("imageUrls") List<String> imageUrls);

    ReviewViewResponse getReviewView(Long reviewNo);

    List<String> getReviewImages(Long reviewNo);

    List<String> getReviewMenu(Long reviewNo);

    List<String> getReviewTags(Long reviewNo);

    List<ReviewCommentResponse> selectCommentList(Long reviewNo);

    int insertComment(@Param("reviewNo") Long reviewNo,
                      @Param("req") ReviewCommentRequest request);

    ReviewCommentResponse selectComment(Long commentNo);

    int updateComment(@Param("commentNo") Long commentNo,
                      @Param("content") String content);

    int deleteComment(Long commentNo);

    List<Recommand> getPopular(Long memberNo);
}
