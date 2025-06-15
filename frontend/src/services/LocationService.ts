// 위치 관련 API 서비스
export interface LocationData {
  address: string;
  roadAddress: string;
  lat: number;
  lng: number;
  district: string;
  city: string;
}

export class LocationService {
  private static readonly API_BASE = '/api/location';

  // 주소 검색 (지오코딩)
  static async searchLocation(query: string): Promise<LocationData[]> {
    try {
      const response = await fetch(`${this.API_BASE}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('주소 검색에 실패했습니다.');
      }

      const data = await response.json();
      
      // 네이버 API 응답 형식에 맞게 변환
      if (data.addresses && data.addresses.length > 0) {
        return data.addresses.map((item: any) => ({
          address: item.jibunAddress || '주소 정보 없음',
          roadAddress: item.roadAddress || '도로명 주소 없음',
          lat: parseFloat(item.y),
          lng: parseFloat(item.x),
          district: item.addressElements?.find((el: any) => 
            el.types.includes('SIGUGUN'))?.longName || '',
          city: item.addressElements?.find((el: any) => 
            el.types.includes('SIDO'))?.longName || ''
        }));
      }

      return [];
    } catch (error) {
      console.error('주소 검색 오류:', error);
      throw error;
    }
  }

  // 역지오코딩 (좌표 → 주소)
  static async reverseGeocode(lat: number, lng: number): Promise<LocationData | null> {
    try {
      const response = await fetch(`${this.API_BASE}/reverse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lng }),
      });

      if (!response.ok) {
        throw new Error('역지오코딩에 실패했습니다.');
      }

      const data = await response.json();
      
      // 네이버 API 응답 형식에 맞게 변환
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const region = result.region;
        const land = result.land;
        
        return {
          address: land?.addition0?.value ? 
            `${region.area1.name} ${region.area2.name} ${region.area3.name} ${land.addition0.value}` :
            `${region.area1.name} ${region.area2.name} ${region.area3.name}`,
          roadAddress: result.land?.addition0?.value || '도로명 주소 없음',
          lat,
          lng,
          district: region.area2?.name || '',
          city: region.area1?.name || ''
        };
      }

      return null;
    } catch (error) {
      console.error('역지오코딩 오류:', error);
      throw error;
    }
  }
}
