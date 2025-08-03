// useProfile.ts - 프로필 관련 로직을 담당하는 커스텀 훅

import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../api/profileApi';
import { UserProfileDTO, ProfileUpdateRequestDTO } from '../dto';
import { isAuthenticated } from '../../../OAuth2/authUtils';

export function useProfile() {
  const navigate = useNavigate();
  
  // 프로필 상태 관리
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 컴포넌트 마운트 시 프로필 정보 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated()) {
        setError('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await profileApi.getMyProfile();
        
        if (response.success && response.data) {
          setProfile(response.data);
          setError(null);
        } else {
          // 실패하면 빈 프로필 상태로 설정
          setProfile({
            userId: 0, // 임시값
            name: '',
            guestPower: 0,
            participationCount: 0
          });
          setError(null);
        }
      } catch (err) {
        // 오류 시에도 빈 프로필 상태로 설정
        setProfile({
          userId: 0, // 임시값
          name: '',
          guestPower: 0,
          participationCount: 0
        });
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);
  
  // 프로필 정보 새로고침
  const refreshProfile = async () => {
    if (!isAuthenticated()) return;
    
    try {
      setIsLoading(true);
      const response = await profileApi.getMyProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
        setError(null);
      } else {
        // 실패하면 빈 프로필 상태로 설정
        setProfile({
          userId: 0,
          name: '',
          guestPower: 0,
          participationCount: 0
        });
        setError(null);
      }
    } catch (err) {
      // 오류 시에도 빈 프로필 상태로 설정
      setProfile({
        userId: 0,
        name: '',
        guestPower: 0,
        participationCount: 0
      });
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    profile,
    isLoading,
    error,
    setError,
    refreshProfile,
    navigate
  };
}

export function useProfileEdit() {
  const navigate = useNavigate();
  
  // 편집 폼 상태 관리
  const [nickname, setNickname] = useState('');
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [activityArea, setActivityArea] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 컴포넌트 마운트 시 기존 프로필 정보 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated()) {
        setError('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await profileApi.getMyProfile();
        
        if (response.success && response.data) {
          const profile = response.data;
          setNickname(profile.nickname || '');
          setSelfIntroduction(profile.selfIntroduction || '');
          setActivityArea(profile.activityArea || '');
          setProfileImageUrl(profile.profileImageUrl || '');
          setError(null);
        } else {
          // 실패하면 빈 상태로 설정
          setNickname('');
          setSelfIntroduction('');
          setActivityArea('');
          setProfileImageUrl('');
          setError(null);
        }
      } catch (err) {
        // 오류 시에도 빈 상태로 설정
        setNickname('');
        setSelfIntroduction('');
        setActivityArea('');
        setProfileImageUrl('');
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);
  
  // 자기소개 글자 수 계산
  const introductionLength = selfIntroduction.length;
  const maxIntroductionLength = 35;
  
  // 자기소개 입력 핸들러 (글자 수 제한)
  const handleIntroductionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxIntroductionLength) {
      setSelfIntroduction(value);
    }
  };
  
  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = async (file: File) => {
    try {
      setIsLoading(true);
      const response = await profileApi.uploadProfileImage(file);
      
      if (response.success && response.data) {
        setProfileImageUrl(response.data.imageUrl);
        setError(null);
      } else {
        setError('프로필 이미지 업로드에 실패했습니다.');
      }
    } catch (err) {
      setError('프로필 이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 프로필 저장 핸들러
  const handleSubmit = async () => {
    if (!isAuthenticated()) {
      setError('로그인이 필요합니다.');
      return;
    }
    
    // 닉네임 필수 검증
    if (!nickname.trim()) {
      setError('닉네임은 필수 입력 항목입니다.');
      return;
    }
    
    try {
      setIsSaving(true);
      
      const profileData: ProfileUpdateRequestDTO = {
        nickname: nickname.trim(),
        selfIntroduction: selfIntroduction.trim() || undefined,
        activityArea: activityArea.trim() || undefined,
        profileImageUrl: profileImageUrl || undefined
      };
      
      const response = await profileApi.updateProfile(profileData);
      
      if (response.success) {
        alert('프로필이 성공적으로 수정되었습니다.');
        navigate('/mypage', { replace: true });
      } else {
        setError(response.message || '프로필 수정에 실패했습니다.');
      }
    } catch (err) {
      setError('프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    // 상태
    nickname, setNickname,
    selfIntroduction, setSelfIntroduction,
    activityArea, setActivityArea,
    profileImageUrl, setProfileImageUrl,
    isLoading,
    isSaving,
    error, setError,
    
    // 계산된 값
    introductionLength,
    maxIntroductionLength,
    
    // 핸들러
    handleIntroductionChange,
    handleProfileImageChange,
    handleSubmit,
    
    // 네비게이션
    navigate
  };
}
