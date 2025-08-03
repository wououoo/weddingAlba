// 프로필 갤러리 관련 API 서비스
export interface ProfileGalleryImage {
  id: number;
  userId: number;
  imageUrl: string;
  imageOrder: number;
  isMain: boolean;
  createdAt: string;
  updatedAt?: string;
}

export class ProfileGalleryService {
  private static readonly API_BASE = '/api/profile/me';

  // 프로필 + 갤러리 통합 저장
  static async saveProfileWithGallery(
    profileData: {
      nickname?: string;
      selfIntroduction?: string;
      activityArea?: string;
    },
    profileImage?: File,
    galleryImages?: File[],
    deleteGalleryImageIds?: number[]
  ): Promise<any> {
    const formData = new FormData();
    
    // 프로필 기본 정보
    if (profileData.nickname) formData.append('nickname', profileData.nickname);
    if (profileData.selfIntroduction) formData.append('selfIntroduction', profileData.selfIntroduction);
    if (profileData.activityArea) formData.append('activityArea', profileData.activityArea);
    
    // 프로필 이미지
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    
    // 갤러리 이미지들
    if (galleryImages && galleryImages.length > 0) {
      galleryImages.forEach(file => {
        formData.append('galleryImages', file);
      });
    }
    
    // 삭제할 갤러리 이미지 ID들
    if (deleteGalleryImageIds && deleteGalleryImageIds.length > 0) {
      deleteGalleryImageIds.forEach(id => {
        formData.append('deleteGalleryImageIds', id.toString());
      });
    }

    const response = await fetch(`${this.API_BASE}/with-gallery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('프로필 저장에 실패했습니다.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '프로필 저장에 실패했습니다.');
    }

    return result.data;
  }

  // 갤러리 이미지 업로드
  static async uploadGalleryImage(file: File): Promise<ProfileGalleryImage> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.API_BASE}/gallery`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('갤러리 이미지 업로드에 실패했습니다.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '갤러리 이미지 업로드에 실패했습니다.');
    }

    return result.data;
  }

  // 갤러리 이미지 목록 조회
  static async getGalleryImages(): Promise<ProfileGalleryImage[]> {
    try {
      console.log('갤러리 API 호출 시작...');
      
      const response = await fetch(`${this.API_BASE}/gallery`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('갤러리 API 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('갤러리 API 오류 응답:', errorText);
        throw new Error('갤러리 이미지 조회에 실패했습니다.');
      }

      const result = await response.json();
      console.log('갤러리 API 응답 데이터:', result);
      
      if (!result.success) {
        console.error('갤러리 API 비즈니스 오류:', result.message);
        throw new Error(result.message || '갤러리 이미지 조회에 실패했습니다.');
      }

      const images = result.data || [];
      console.log('최종 갤러리 이미지 배열:', images);
      
      return images;
    } catch (error) {
      console.error('갤러리 이미지 조회 중 오류:', error);
      throw error;
    }
  }

  // 갤러리 이미지 삭제
  static async deleteGalleryImage(imageId: number): Promise<void> {
    const response = await fetch(`${this.API_BASE}/gallery/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('갤러리 이미지 삭제에 실패했습니다.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '갤러리 이미지 삭제에 실패했습니다.');
    }
  }

  // 갤러리 이미지 순서 변경
  static async updateGalleryOrder(imageIds: number[]): Promise<void> {
    const response = await fetch(`${this.API_BASE}/gallery/order`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageIds),
    });

    if (!response.ok) {
      throw new Error('갤러리 이미지 순서 변경에 실패했습니다.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '갤러리 이미지 순서 변경에 실패했습니다.');
    }
  }

  // 갤러리 이미지를 메인으로 설정
  static async setMainGalleryImage(imageId: number): Promise<void> {
    const response = await fetch(`${this.API_BASE}/gallery/${imageId}/set-main`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('메인 이미지 설정에 실패했습니다.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '메인 이미지 설정에 실패했습니다.');
    }
  }

  // 메인 프로필 이미지 업로드 (파일)
  static async uploadProfileImage(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.API_BASE}/image/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('프로필 이미지 업로드에 실패했습니다.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '프로필 이미지 업로드에 실패했습니다.');
    }

    return result.data;
  }
}
