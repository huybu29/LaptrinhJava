package project.repo.dtos;

import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    private Long userId;
    
    private Long stationId;
    
    private Long paymentId;

    private Integer rating; // 1-5 sao

    private String comment;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;
}