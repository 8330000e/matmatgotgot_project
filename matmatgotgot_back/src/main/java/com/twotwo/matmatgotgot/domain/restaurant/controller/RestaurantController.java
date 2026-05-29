package com.twotwo.matmatgotgot.domain.restaurant.controller;

import com.twotwo.matmatgotgot.domain.restaurant.dto.request.RestCreateRequest;
import com.twotwo.matmatgotgot.domain.restaurant.service.RestaurantService;
import com.twotwo.matmatgotgot.global.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping(value="/restaurants")
public class RestaurantController {

    @Value("${file.root}")
    private String root;

    private final RestaurantService restaurantService;
    private final FileUtil fileUtil;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RestCreateRequest request) {
        System.out.println(request);

        Document doc = Jsoup.parse(request.getContent());

        // 이미지 태그 선택자로 첫 번째 요소를 가져옴
        // 단, 이미지 태그가 한 개도 없으면 null 리턴
        Element firstImg = doc.selectFirst("img");
        String restThumb = firstImg == null ? null : firstImg.attr("src");
        request.setRestThumb(restThumb);

        int result = restaurantService.create(request);

        return null;
    }//

    @PostMapping(value="/image-upload")
    public ResponseEntity<?> imageUpload(@RequestParam MultipartFile image){
        String savepath = root + "restaurant/";
        String filepath = fileUtil.upload(savepath, image);

        return ResponseEntity.ok(filepath);
    }//
}
