package wedding.alba.function.profile;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequestDTO {
    private String nickname;

    private String selfIntroduction;

    private String activityArea;

    private String profileImageUrl;
}
