package com.fuswx.distributed_renew.Bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DevStatusAndId {
    private DevStatus devStatus;
    private Integer devStatusId;
}
