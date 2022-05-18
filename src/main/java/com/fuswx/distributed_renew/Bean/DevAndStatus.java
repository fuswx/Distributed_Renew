package com.fuswx.distributed_renew.Bean;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
public class DevAndStatus {
    @JsonProperty("id")
    private String Id;
    @JsonProperty("position")
    private String position;
    @JsonProperty("last_status")
    private DevStatus lastStatus;
    @JsonProperty("longitude")
    private Double longitude;
    @JsonProperty("latitude")
    private Double latitude;
    @JsonProperty("add_time")
    private Date addTime;
}
