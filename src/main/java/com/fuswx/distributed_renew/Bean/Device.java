package com.fuswx.distributed_renew.Bean;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class Device {
    private String Id;
    private String position;
    private Date addTime;
}
