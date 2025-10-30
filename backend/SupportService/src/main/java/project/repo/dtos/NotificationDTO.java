package project.repo.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private String title;
    private String message;
    private String receiverType;
    private boolean readStatus;
    private LocalDateTime createdAt;
}
