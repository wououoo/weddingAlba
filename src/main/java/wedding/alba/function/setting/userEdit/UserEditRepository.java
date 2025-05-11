package wedding.alba.function.setting.userEdit;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import wedding.alba.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Repository
public interface UserEditRepository extends JpaRepository<User, Long> {


}
