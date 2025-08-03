package wedding.alba.function.profile;

import java.time.LocalDateTime;

/**
 * 프로필 갤러리 응답 DTO
 */
public class ProfileGalleryDto {
    
    private Long id;
    private Long userId;
    private String imageUrl;
    private Integer imageOrder;
    private Boolean isMain;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 기본 생성자
    public ProfileGalleryDto() {}
    
    // 전체 생성자
    public ProfileGalleryDto(Long id, Long userId, String imageUrl, Integer imageOrder, 
                           Boolean isMain, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.imageUrl = imageUrl;
        this.imageOrder = imageOrder;
        this.isMain = isMain;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // 엔티티로부터 DTO 생성하는 생성자
    public ProfileGalleryDto(wedding.alba.entity.ProfileGallery entity) {
        this.id = entity.getId();
        this.userId = entity.getUserId();
        this.imageUrl = entity.getImageUrl();
        this.imageOrder = entity.getImageOrder();
        this.isMain = entity.getIsMain();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }
    
    // Getter & Setter
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public Integer getImageOrder() {
        return imageOrder;
    }
    
    public void setImageOrder(Integer imageOrder) {
        this.imageOrder = imageOrder;
    }
    
    public Boolean getIsMain() {
        return isMain;
    }
    
    public void setIsMain(Boolean isMain) {
        this.isMain = isMain;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Override
    public String toString() {
        return "ProfileGalleryDto{" +
                "id=" + id +
                ", userId=" + userId +
                ", imageUrl='" + imageUrl + '\'' +
                ", imageOrder=" + imageOrder +
                ", isMain=" + isMain +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
