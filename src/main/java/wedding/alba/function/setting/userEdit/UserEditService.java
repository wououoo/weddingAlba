package wedding.alba.function.setting.userEdit;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wedding.alba.dto.ApiResponse;
import wedding.alba.entity.User;
import wedding.alba.repository.UserRepository;

import java.util.NoSuchElementException;

/**
 * 사용자 정보 수정 서비스
 * 사용자 정보 조회 및 수정 기능을 제공
 */
@Service
@Slf4j
public class UserEditService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserEditRepository userEditRepository;
    
    /**
     * 사용자 ID로 사용자 정보 조회
     * 
     * @param userId 사용자 ID
     * @return 사용자 정보 응답 DTO
     * @throws NoSuchElementException 사용자가 존재하지 않을 경우
     */
    @Transactional(readOnly = true)
    public ApiResponse<UserEditResponseDto> getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId));
        
        UserEditResponseDto responseDto = UserEditResponseDto.fromEntity(user);
        return ApiResponse.success(responseDto);
    }
    
    /**
     * 사용자 정보 수정
     * 
     * @param userId 사용자 ID
     * @param request 사용자 정보 수정 요청 DTO
     * @return 수정된 사용자 정보 응답 DTO
     * @throws NoSuchElementException 사용자가 존재하지 않을 경우
     */
    @Transactional
    public ApiResponse<UserEditResponseDto> updateUserInfo(Long userId, UserEditRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId));
        
        // 수정 가능한 필드만 업데이트 (빈 문자열과 null 처리 개선)
        
        // 이름은 필수 (빈 문자열 체크)
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        
        // 선택적 필드들 - null이 아니고 빈 문자열이 아닌 경우만 업데이트
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        
        if (request.getBirth() != null) {
            user.setBirth(request.getBirth());
        }
        
        if (request.getAddressCity() != null && !request.getAddressCity().trim().isEmpty()) {
            user.setAddressCity(request.getAddressCity().trim());
        }
        
        if (request.getAddressDistrict() != null && !request.getAddressDistrict().trim().isEmpty()) {
            user.setAddressDistrict(request.getAddressDistrict().trim());
        }
        
        if (request.getAddressDetail() != null && !request.getAddressDetail().trim().isEmpty()) {
            user.setAddressDetail(request.getAddressDetail().trim());
        }

        log.info("사용자 정보 업데이트 요청 - userId: {}, name: {}, phone: {}", 
                 userId, request.getName(), request.getPhoneNumber());
        
        User updatedUser = userRepository.save(user);
        log.info("사용자 정보가 업데이트되었습니다. ID: {}", userId);
        
        UserEditResponseDto responseDto = UserEditResponseDto.fromEntity(updatedUser);
        return ApiResponse.success(responseDto);
    }
}
