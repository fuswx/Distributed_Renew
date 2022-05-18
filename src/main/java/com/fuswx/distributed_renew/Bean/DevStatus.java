package com.fuswx.distributed_renew.Bean;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DevStatus {
    @JsonProperty("indexId")
    private Integer id;
    @JsonProperty("id")
    private String devId;
    @JsonProperty("level")
    private Double devLevel;
    @JsonProperty("battery")
    private Integer devBattery;
    @JsonProperty("temperature")
    private Double devTemperature;
    @JsonProperty("humidity")
    private Double devHumidity;
    @JsonProperty("upload_time")
    private Date uploadTime;
}
