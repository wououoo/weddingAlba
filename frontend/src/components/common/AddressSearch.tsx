import React, { useEffect, useRef } from 'react';
import { DaumPostcodeData } from '../../types/daum-postcode';

interface AddressSearchProps {
  onComplete: (data: DaumPostcodeData) => void;
  onClose?: () => void;
  className?: string;
}

// 전역 타입 선언
declare global {
  interface Window {
    daum: any;
  }
}

const AddressSearch: React.FC<AddressSearchProps> = ({ 
  onComplete, 
  onClose,
  className = '' 
}) => {
  const postcodeRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef<boolean>(false);

  useEffect(() => {
    // 이미 로드된 스크립트가 있는지 확인
    const existingScript = document.querySelector('script[src*="postcode/prod/postcode.v2.js"]');
    
    if (!window.daum || !window.daum.Postcode) {
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        script.onload = () => {
          scriptLoaded.current = true;
          initPostcode();
        };
        document.head.appendChild(script);
      } else {
        // 스크립트는 이미 있지만 아직 로드가 완료되지 않은 경우
        // 100ms 간격으로 확인
        const checkInterval = setInterval(() => {
          if (window.daum && window.daum.Postcode) {
            clearInterval(checkInterval);
            scriptLoaded.current = true;
            initPostcode();
          }
        }, 100);
        
        // 5초 후에도 로드되지 않으면 인터벌 종료
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!scriptLoaded.current) {
            console.error('Daum postcode script failed to load in 5 seconds');
          }
        }, 5000);
      }
    } else {
      // 이미 로드된 경우
      scriptLoaded.current = true;
      initPostcode();
    }
    
    return () => {
      // 컴포넌트가 언마운트될 때 클리어업
      scriptLoaded.current = false;
    };
  }, []);

  const initPostcode = () => {
    if (!postcodeRef.current || !window.daum || !window.daum.Postcode) {
      console.error('Postcode div ref or daum postcode object is not available');
      return;
    }

    try {
      setTimeout(() => {
        const postcodeInstance = new window.daum.Postcode({
          oncomplete: (data: any) => {
            console.log('Daum postcode data:', data); // 디버깅 로그 추가
            
            // 필요한 데이터만 추출하여 전달
            onComplete({
              zonecode: data.zonecode || '',
              address: data.address || '',
              addressType: data.addressType || 'R',
              roadAddress: data.roadAddress || '',
              jibunAddress: data.jibunAddress || '',
              bname: data.bname || '',
              buildingName: data.buildingName || '',
              apartment: data.apartment || 'N',
              userSelectedType: data.userSelectedType,
              sido: data.sido || '',
              sigungu: data.sigungu || ''
            });
            
            if (onClose) onClose();
          },
          width: '100%',
          height: '100%'
        });
        
        postcodeInstance.embed(postcodeRef.current);
      }, 300); // 약간의 지연을 추가하여 DOM이 완전히 준비되게 함
    } catch (e) {
      console.error('Daum postcode error:', e);
    }
  };

  return (
    <div className={`${className} w-full`}>
      <div 
        ref={postcodeRef} 
        style={{ width: '100%', height: '450px' }}
        className="border rounded"
      />
    </div>
  );
};

export default AddressSearch;