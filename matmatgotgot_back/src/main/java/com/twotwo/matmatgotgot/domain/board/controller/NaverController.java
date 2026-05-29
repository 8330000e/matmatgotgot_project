package com.twotwo.matmatgotgot.domain.board.controller;

import java.net.URI;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

    @RestController
    @RequestMapping("/api/naver")
    @CrossOrigin("*")
    public class NaverController {

        @Value("${naver.client-id}")
        private String clientId;

        @Value("${naver.secret}")
        private String secret;

        @GetMapping("/{query}")
        public ResponseEntity<?> search(@PathVariable String query){

            System.out.println("clientId = " + clientId);
            System.out.println("secret = " + secret);

            return ResponseEntity.ok(getPlace(query));
        }

        private List<Map<String,String>> getPlace(String query){
            List<Map<String,String>> list = new ArrayList<>();
            try {
                URI uri = UriComponentsBuilder
                        .fromUriString("https://openapi.naver.com")
                        .path("/v1/search/local.json")
                        .queryParam("query", query)
                        .queryParam("display", 8)
                        .build()
                        .encode()
                        .toUri();

                RestTemplate rt = new RestTemplate();

                RequestEntity<Void> req = RequestEntity.get(uri)
                        .header("X-Naver-Client-Id", clientId)
                        .header("X-Naver-Client-Secret", secret)
                        .build();

                ResponseEntity<String> res = rt.exchange(req, String.class);

                ObjectMapper om = new ObjectMapper();
                JsonNode root = om.readTree(res.getBody());

                // Controller 내부의 루프문
                for(JsonNode item : root.path("items")){
                    Map<String,String> map = new HashMap<>();
                    map.put("title", item.path("title").asText().replaceAll("<[^>]*>", ""));
                    map.put("address", item.path("address").asText());
                    map.put("latitude", item.path("mapy").asText());  // 수정하지 말고 그대로 전달
                    map.put("longitude", item.path("mapx").asText()); // 수정하지 말고 그대로 전달
                    list.add(map);
                }
            } catch(Exception e){
                e.printStackTrace();
            }
            return list;
        }
    }