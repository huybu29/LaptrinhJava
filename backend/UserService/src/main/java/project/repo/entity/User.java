package project.repo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
@Entity
@Table(name = "users")   // bảng DB là "users"
@Data                   // tự động sinh getter, setter, toString, equals/hashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String password;

    private String role; // ROLE_USER, ROLE_ADMIN, ROLE_DRIVER, ROLE_STAFF

    // Thông tin cơ bản                                 
    private String fullName;
    private String email;
    private String phone;

    // Quan hệ 1-1 đến các profile
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role)); // role là String
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
