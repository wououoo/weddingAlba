package wedding.alba.function.setting.userEdit;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    public UserEditDto.Response getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId));
        
        return UserEditDto.Response.fromEntity(user);
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
    public UserEditDto.Response updateUserInfo(Long userId, UserEditDto.Request request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId));
        
        // 수정 가능한 필드만 업데이트
        user.setName(request.getName());
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getBirth() != null) {
            user.setBirth(request.getBirth());
        }
        if (request.getAddressCity() != null) {
            user.setAddressCity(request.getAddressCity());
        }
        if (request.getAddressDistrict() != null) {
            user.setAddressDistrict(request.getAddressDistrict());
        }
        if (request.getAddressDetail() != null) {
            user.setAddressDetail(request.getAddressDetail());
        }
        

        
        User updatedUser = userRepository.save(user);
        log.info("사용자 정보가 업데이트되었습니다. ID: {}", userId);
        
        return UserEditDto.Response.fromEntity(updatedUser);
    }
}
