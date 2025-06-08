import React, { useState, useEffect, useRef } from 'react';
import { LocationService, LocationData } from '../../services/LocationService';

interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
  onClose: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ value, onChange, onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(null);

  // 네이버 지도 초기화 (백엔드 config API 사용)
  useEffect(() => {
    const loadMapConfig = async () => {
      try {
        // 백엔드에서 지도 설정 가져오기
        const response = await fetch('/api/location/config');
        const config = await response.json();
        
        const initMap = () => {
          if (!window.naver || !mapRef.current) return;

          // 기본 위치 (서울 시청)
          const defaultLocation = new window.naver.maps.LatLng(37.5666805, 126.9784147);
          
          const mapOptions = {
            center: defaultLocation,
            zoom: 15,
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: window.naver.maps.MapTypeControlStyle.BUTTON,
              position: window.naver.maps.Position.TOP_RIGHT
            },
            zoomControl: true,
            zoomControlOptions: {
              style: window.naver.maps.ZoomControlStyle.SMALL,
              position: window.naver.maps.Position.RIGHT_CENTER
            }
          };

          const mapInstance = new window.naver.maps.Map(mapRef.current, mapOptions);
          setMap(mapInstance);

          // 지도 클릭 이벤트
          window.naver.maps.Event.addListener(mapInstance, 'click', (e: any) => {
            const lat = e.coord.lat();
            const lng = e.coord.lng();
            handleLocationSelect(lat, lng);
          });

          // 현재 위치 가져오기
          getCurrentLocation(mapInstance);
        };

        // 네이버 지도 API 로드 (백엔드에서 제공하는 URL 사용)
        if (!window.naver) {
          const script = document.createElement('script');
          script.src = config.mapApiUrl;
          script.onload = initMap;
          script.onerror = () => {
            console.error('네이버 지도 API 로드 실패');
            // fallback으로 공개 API 사용
            const fallbackScript = document.createElement('script');
            fallbackScript.src = 'https://openapi.map.naver.com/openapi/v3/maps.js';
            fallbackScript.onload = initMap;
            document.head.appendChild(fallbackScript);
          };
          document.head.appendChild(script);
        } else {
          initMap();
        }
      } catch (error) {
        console.error('지도 설정 로드 실패:', error);
        // fallback으로 공개 API 사용
        const script = document.createElement('script');
        script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js';
        script.onload = () => {
          if (!window.naver || !mapRef.current) return;
          const defaultLocation = new window.naver.maps.LatLng(37.5666805, 126.9784147);
          const mapOptions = {
            center: defaultLocation,
            zoom: 15,
            mapTypeControl: true,
            zoomControl: true
          };
          const mapInstance = new window.naver.maps.Map(mapRef.current, mapOptions);
          setMap(mapInstance);
        };
        document.head.appendChild(script);
      }
    };

    loadMapConfig();
  }, []);

  // 현재 위치 가져오기
  const getCurrentLocation = (mapInstance: any) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const currentPos = { lat, lng };
          setCurrentPosition(currentPos);
          
          if (mapInstance) {
            const location = new window.naver.maps.LatLng(lat, lng);
            mapInstance.setCenter(location);
            handleLocationSelect(lat, lng);
          }
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
        }
      );
    }
  };

  // 위치 선택 처리 (백엔드 API 사용)
  const handleLocationSelect = async (lat: number, lng: number) => {
    if (!map) return;

    // 기존 마커 제거
    if (marker) {
      marker.setMap(null);
    }

    // 새 마커 생성
    const newMarker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map: map
    });
    setMarker(newMarker);

    // 백엔드 API로 역지오코딩
    try {
      setIsLoading(true);
      const locationData = await LocationService.reverseGeocode(lat, lng);
      
      if (locationData) {
        setSelectedLocation(locationData);
      } else {
        // 기본 위치 정보 설정
        setSelectedLocation({
          address: '주소 정보 없음',
          roadAddress: '도로명 주소 없음',
          lat,
          lng,
          district: '',
          city: ''
        });
      }
    } catch (error) {
      console.error('주소 변환 중 오류:', error);
      // 오류 시 기본 위치 정보 설정
      setSelectedLocation({
        address: '주소 정보 없음',
        roadAddress: '도로명 주소 없음',
        lat,
        lng,
        district: '',
        city: ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 키워드 검색 (백엔드 API 사용)
  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;

    try {
      setIsLoading(true);
      const results = await LocationService.searchLocation(searchKeyword);
      
      setSearchResults(results);
      
      if (results.length > 0) {
        const firstResult = results[0];
        if (map) {
          map.setCenter(new window.naver.maps.LatLng(firstResult.lat, firstResult.lng));
          handleLocationSelect(firstResult.lat, firstResult.lng);
        }
      } else {
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('검색 오류:', error);
      alert('검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 결과 선택
  const handleSearchResultSelect = (location: LocationData) => {
    if (map) {
      map.setCenter(new window.naver.maps.LatLng(location.lat, location.lng));
      handleLocationSelect(location.lat, location.lng);
    }
    setSearchResults([]);
    setSearchKeyword('');
  };

  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (currentPosition && map) {
      map.setCenter(new window.naver.maps.LatLng(currentPosition.lat, currentPosition.lng));
      handleLocationSelect(currentPosition.lat, currentPosition.lng);
    } else {
      getCurrentLocation(map);
    }
  };

  // 위치 확인
  const handleConfirm = () => {
    if (selectedLocation) {
      const locationString = `${selectedLocation.city} ${selectedLocation.district}`;
      onChange(locationString);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">활동 지역 선택</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 검색 영역 */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="지역명을 입력하세요 (예: 강남구, 홍대)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              검색
            </button>
          </div>
          
          <button
            onClick={moveToCurrentLocation}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            현재 위치
          </button>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex">
          {/* 지도 영역 */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full"></div>
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-md flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
                  <span>위치 정보를 가져오는 중...</span>
                </div>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="w-80 border-l bg-gray-50 flex flex-col">
            {/* 검색 결과 */}
            {searchResults.length > 0 && (
              <div className="p-4 border-b">
                <h3 className="font-medium mb-2">검색 결과</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchResultSelect(result)}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                    >
                      <div className="font-medium">{result.roadAddress}</div>
                      <div className="text-gray-600">{result.address}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 선택된 위치 정보 */}
            <div className="flex-1 p-4">
              <h3 className="font-medium mb-3">선택된 위치</h3>
              {selectedLocation ? (
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded border">
                    <div className="font-medium text-sm mb-1">도로명 주소</div>
                    <div className="text-gray-700">{selectedLocation.roadAddress}</div>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <div className="font-medium text-sm mb-1">지번 주소</div>
                    <div className="text-gray-700">{selectedLocation.address}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="font-medium text-sm mb-1 text-blue-800">활동 지역</div>
                    <div className="text-blue-700 font-medium">
                      {selectedLocation.city} {selectedLocation.district}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  지도에서 위치를 선택하거나<br />
                  검색해주세요
                </div>
              )}
            </div>

            {/* 확인 버튼 */}
            <div className="p-4 border-t">
              <button
                onClick={handleConfirm}
                disabled={!selectedLocation}
                className={`w-full py-3 rounded-md font-medium ${
                  selectedLocation
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                이 위치로 설정하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;