package com.fuswx.distributed_renew.Controller;

import com.fuswx.distributed_renew.Bean.DevAndStatus;
import com.fuswx.distributed_renew.Bean.DevStatus;
import com.fuswx.distributed_renew.Service.IDeviceService;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;

@Controller
public class DeviceController {

    @Autowired
    private IDeviceService deviceService;

    @GetMapping("/device")
    @ResponseBody
    public void setDevices(@RequestBody ArrayList<DevAndStatus> devices){
        deviceService.setDevices(devices);
    }

    @PutMapping("/data")
    @ResponseBody
    public void setDevStatus(@RequestBody DevStatus devStatus){
        deviceService.setDevStatus(devStatus);
    }

    @RequestMapping("/dev/getAllDevStatus")
    public @ResponseBody ArrayList<DevStatus> getAllDevStatus(){
        return deviceService.getAllDevStatus();
    }

    @RequestMapping("/dev/getDevStatus")
    public @ResponseBody DevStatus getDevStatus(String id){
        return deviceService.getDevStatus(id);
    }

    @PostMapping("/dev/getDevStatusMapByIndex")
    public @ResponseBody ArrayList<DevStatus> getAllDevStatusMap(String devId,Integer index){
        return deviceService.getDevStatusMap(devId,index);
    }

    @PostMapping("/dev/getDevXXXMapByIndex")
    public @ResponseBody LinkedHashMap<Date,Double> getAllDevStatusMap(String devId, Integer index, String type){
        return deviceService.getDevXXXStatusMap(devId,index,type);
    }

    @PostMapping("/dev/getAllDevStatusByReason")
    public @ResponseBody ArrayList<DevStatus> getAllDevStatusByReason(String findReason){
        return deviceService.getAllDevStatusByReason(findReason);
    }

}
