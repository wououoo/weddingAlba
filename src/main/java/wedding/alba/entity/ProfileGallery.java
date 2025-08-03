package wedding.alba.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "profile_gallery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileGallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "image_order", nullable = false)
    @Builder.Default
    private Integer imageOrder = 0;

    @Column(name = "is_main", nullable = false)
    @Builder.Default
    private Boolean isMain = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 커스텀 생성자 (기존 코드 호환성을 위해)
    public ProfileGallery(Long userId, String imageUrl, Integer imageOrder) {
        this.userId = userId;
        this.imageUrl = imageUrl;
        this.imageOrder = imageOrder;
        this.isMain = false;
        this.createdAt = LocalDateTime.now();
    }

    public ProfileGallery(Long userId, String imageUrl, Integer imageOrder, Boolean isMain) {
        this.userId = userId;
        this.imageUrl = imageUrl;
        this.imageOrder = imageOrder;
        this.isMain = isMain;
        this.createdAt = LocalDateTime.now();
    }

    // JPA 라이프사이클 메서드
    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isMain == null) {
            this.isMain = false;
        }
        if (this.imageOrder == null) {
            this.imageOrder = 0;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
