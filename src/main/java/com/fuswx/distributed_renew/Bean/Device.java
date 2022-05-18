package com.fuswx.distributed_renew.Bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Device {
    private String Id;
    private String position;
    private Double longitude;
    private Double latitude;
    private Date addTime;
}
