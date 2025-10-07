package project.repo.repository;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Repository;
import project.repo.entity.User;

@Repository
public class UserRepository {

    public List<User> findAll() {
        return Arrays.asList(
            new User(1, "ThanhTuyen"),
            new User(2, "BichThui"),
            new User(3, "Charlie")
        );
    }
}
