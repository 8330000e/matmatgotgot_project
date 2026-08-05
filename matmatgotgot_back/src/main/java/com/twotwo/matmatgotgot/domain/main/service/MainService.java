package com.twotwo.matmatgotgot.domain.main.service;

import com.twotwo.matmatgotgot.domain.main.dto.response.MainBestReviewDTO;
import com.twotwo.matmatgotgot.domain.main.dto.response.MainBestTourDTO;
import com.twotwo.matmatgotgot.domain.main.mapper.MainMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MainService {
    private final MainMapper mainMapper;

    public MainService(MainMapper mainMapper) {
        this.mainMapper = mainMapper;
    }

    public List<MainBestReviewDTO> getBestReviews() {
        log.info("Service 진입");
        return mainMapper.findBestReviews();
    }

    public List<MainBestTourDTO> getBestTours() {
        return mainMapper.findBestTours();
    }
}
