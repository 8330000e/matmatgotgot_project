import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './NaverSearch.css';
import Swal from 'sweetalert2';

const NaverSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef({
    searchMarkers: [],
    clickedMarker: null,
  });

  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_KEY}&submodules=geocoder`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.978),
      zoom: 14,
    });
  };

  const search = async () => {
    if (!query.trim()) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/api/naver/${query}`,
      );
      const data = res.data;
      setPlaces(data);

      if (data && data.length > 0) {
        handlePlaceClick(data[0], false);
      }
    } catch (e) {
      console.error(e);
      alert('검색 실패');
    }
  };

  const handlePlaceClick = (place, isManual = true) => {
    if (!mapInstance.current) return;

    const rawX = Number(place.longitude);
    const rawY = Number(place.latitude);
    let latlng;

    if (rawX > 10000000) {
      latlng = new window.naver.maps.LatLng(rawY / 10000000, rawX / 10000000);
    } else if (window.naver.maps.TransCoord) {
      const tm128 = new window.naver.maps.Point(rawX, rawY);
      latlng = window.naver.maps.TransCoord.fromTM128ToLatLng(tm128);
    }

    if (!latlng) return;

    mapInstance.current.setCenter(latlng);
    mapInstance.current.setZoom(16);

    if (markers.current.clickedMarker) {
      markers.current.clickedMarker.setMap(null);
    }

    const marker = new window.naver.maps.Marker({
      position: latlng,
      map: mapInstance.current,
      icon: {
        content: `<span class="material-icons" style="font-size:32px; color:#1976d2;">location_on</span>`,
        anchor: new window.naver.maps.Point(16, 32),
      },
      animation: window.naver.maps.Animation.DROP,
    });

    const infoWindow = new window.naver.maps.InfoWindow({
      content: `<div class="info-window-content">${place.title.replace(/<[^>]*>?/gm, '')}</div>`,
      borderWidth: 0,
      backgroundColor: 'transparent',
      disableAnchor: true,
    });

    infoWindow.open(mapInstance.current, marker);
    markers.current.clickedMarker = marker;

    if (isManual) {
      const cleanTitle = place.title.replace(/<[^>]*>?/gm, '');
      Swal.fire({
        icon: 'question',
        iconColor: '#f39c12',
        text: `'${cleanTitle}'을(를) 선택하시겠습니까?`,
        showCancelButton: true,
        confirmButtonColor: 'var(--color1)',
        cancelButtonColor: 'var(--color5)',
        confirmButtonText: '선택',
        cancelButtonText: '취소',
      }).then((result) => {
        if (result.isConfirmed) {
          // 돌아갈 때 아까 받았던 데이터를 다시 가져감
          navigate('/board/write', {
            state: {
              selectedPlace: cleanTitle,
              category: 2,
              // WritePage에서 넘어왔던 데이터를 그대로 반송
              prevBoard: location.state?.prevBoard,
            },
          });
        }
      });
    }
  };

  return (
    <div className="naver-search-container">
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <div className="search-box">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="장소명을 입력하세요."
        />
        <button onClick={search}>검색</button>
      </div>
      <div className="map-view" ref={mapRef} />
      <div className="places-list">
        {places.map((p, i) => (
          <div
            key={i}
            className="place-item"
            onClick={() => handlePlaceClick(p, true)}
          >
            <strong dangerouslySetInnerHTML={{ __html: p.title }} />
            <p>{p.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NaverSearch;
