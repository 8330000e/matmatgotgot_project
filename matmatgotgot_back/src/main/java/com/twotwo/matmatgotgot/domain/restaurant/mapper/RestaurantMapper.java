package com.twotwo.matmatgotgot.domain.restaurant.mapper;

import com.twotwo.matmatgotgot.domain.restaurant.dto.request.RestViewReviewsRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.request.ReviewCommentRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.request.ReviewCreateRequest;
import com.twotwo.matmatgotgot.domain.restaurant.dto.response.*;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Coords;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Recommand;
import com.twotwo.matmatgotgot.domain.restaurant.entity.Restaurant;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface RestaurantMapper {

    int restaurantCreate(Restaurant restaurant);

    RestViewResponse restaurantViewInfo(@Param("memberId") String memberId,
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

    List<Recommand> getPopular(String memberId);

    List<Recommand> getLike(String memberId);

    List<Recommand> getRegion(@Param("memberId") String memberId,
                              @Param("coords") Coords coords);

    // Main
    List<Restaurant> selectMyWishList(@Param("memberId") String memberId);
    List<Restaurant> selectPopularList();
    List<Restaurant> selectAllList();
    List<RestaurantMapMarkerDTO> selectWishMapMarkers(@Param("memberId") String memberId);
    List<RestaurantMapMarkerDTO> selectVisitedMapMarkers(@Param("memberId") String memberId);
}
