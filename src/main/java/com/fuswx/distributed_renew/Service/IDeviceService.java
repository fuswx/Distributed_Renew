package com.fuswx.distributed_renew.Service;

import com.fuswx.distributed_renew.Bean.DevAndStatus;
import com.fuswx.distributed_renew.Bean.DevStatus;
import org.apache.ibatis.annotations.Select;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;

public interface IDeviceService {
    void setDevices(ArrayList<DevAndStatus> devices);

    void setDevStatus(DevStatus devStatus);

    DevStatus getDevStatus(String id);

    ArrayList<DevStatus> getAllDevStatus();

    ArrayList<DevStatus> getDevStatusMap(String devId,Integer index);

    LinkedHashMap<Date,Double> getDevXXXStatusMap(String devId, Integer index, String type);

    ArrayList<String> getDevIdByReason(String findReason);

    ArrayList<DevStatus> getAllDevStatusByReason(String findReason);
    
    ArrayList<String> getAllDevId();

    ArrayList<String> getAllPosition();
}
