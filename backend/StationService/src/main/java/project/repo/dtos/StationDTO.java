package project.repo.dtos;

import lombok.Data;

@Data
public class StationDTO {
    private Long id;
    private String name;
    private String location;
    private int capacity;
    private Double latitude;
    private Double longitude;
    private String status;
}
