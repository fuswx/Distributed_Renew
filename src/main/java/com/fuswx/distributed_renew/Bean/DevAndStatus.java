package com.fuswx.distributed_renew.Bean;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
public class DevAndStatus {
    @JsonProperty("id")
    private String Id;
    @JsonProperty("add_time")
    private Date addTime;
    @JsonProperty("position")
    private String position;
    @JsonProperty("last_status")
    private DevStatus lastStatus;
}
