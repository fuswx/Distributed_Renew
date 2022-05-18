package com.fuswx.distributed_renew.Service.impl;

import com.fuswx.distributed_renew.Bean.DevAndStatus;
import com.fuswx.distributed_renew.Bean.DevStatus;
import com.fuswx.distributed_renew.Bean.DevStatusAndId;
import com.fuswx.distributed_renew.Bean.Device;
import com.fuswx.distributed_renew.Mapper.DeviceMapper;
import com.fuswx.distributed_renew.Service.IDeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.*;

@Transactional
@Service
public class DeviceServiceImpl implements IDeviceService {

    @Autowired
    private DeviceMapper deviceMapper;

    @Autowired
    private RestTemplate restTemplate;

    SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Override
    public void setDevices(ArrayList<DevAndStatus> devices) {
        for (DevAndStatus device : devices) {
            String devOnceId=formatDevId(device.getId());
            deviceMapper.createDevStatus(devOnceId);
            deviceMapper.setDevice(new Device(device.getId(),device.getPosition(),device.getLongitude(),device.getLatitude(),device.getAddTime()));
            deviceMapper.setDevStatus(new DevStatus(null,device.getId(),device.getLastStatus().getDevLevel(), device.getLastStatus().getDevBattery(), device.getLastStatus().getDevTemperature(), device.getLastStatus().getDevHumidity(),device.getAddTime()),devOnceId);
        }
    }

    @Override
    public void setDevStatus(DevStatus devStatus) {
        SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy.MM.dd HH:mm:ss");
        if (devStatus.getUploadTime()==null){
            devStatus.setUploadTime(new Date());
        }
        deviceMapper.setDevStatus(devStatus, formatDevId(devStatus.getDevId()));
        if (devStatus.getDevLevel()>=140){
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentType(MediaType.APPLICATION_JSON);
            Map<String,Object> requestParam=new HashMap<>();
            requestParam.put("secret","eb87c769-b6f4-4d37-aad6-7dcd62b5b66c");
            requestParam.put("tittle","水位超过预警");
            requestParam.put("content","地铁1号线-紫金山路站\n报警时间:"+simpleDateFormat.format(devStatus.getUploadTime())+"\n当前水位:"+devStatus.getDevLevel()+"mm");
            HttpEntity<Map<String,Object>> request=new HttpEntity<Map<String, Object>>(requestParam,httpHeaders);
            String s=request.toString();
            ResponseEntity<String> entity=restTemplate.exchange("https://push.hyun.tech/send", HttpMethod.POST,request,String.class);
        }
    }



    @Override
    public DevStatus getDevStatus(String id) {
        return deviceMapper.getDevLastStatus(formatDevId(id));
    }

    @Override
    public ArrayList<DevStatus> getAllDevStatus() {
        ArrayList<DevStatus> devStatuses=new ArrayList<>();
        ArrayList<String> devIds=deviceMapper.getAllDevstatusId();
        for (String devId: devIds) {
            devStatuses.add(deviceMapper.getDevLastStatus(formatDevId(devId)));
        }
        return devStatuses;
    }

    @Override
    public ArrayList<DevStatus> getDevStatusMap(String devId,Integer index) {
        devId=formatDevId(devId);
        ArrayList<DevStatus> devStatusMap=new ArrayList<>();
        DevStatus devStatus=deviceMapper.getDevLastStatus(devId);
        //Long now=devStatus.getUploadTime().getTime();
        Integer devStatusId=devStatus.getId();
        for (int i = 0; i <= index-1; i++) {
            DevStatusAndId devStatusAndId =CheckZero(devId,devStatusId);
            devStatusId= devStatusAndId.getDevStatusId();
            devStatusMap.add(0, devStatusAndId.getDevStatus());
        }
        return devStatusMap;
    }

    @Override
    public LinkedHashMap<Date,Double> getDevXXXStatusMap(String devId, Integer index, String type) {
        devId=formatDevId(devId);
        LinkedHashMap<Date,Double> devStatusMap=new LinkedHashMap<>();
        DevStatus devStatus=deviceMapper.getDevLastStatus(devId);
        //Long now=devStatus.getUploadTime().getTime();
        Integer devStatusId=devStatus.getId();
        for (int i = 0; i <= index-1; i++) {
            DevStatusAndId devStatusAndId =CheckZero(devId,devStatusId);
            devStatusId= devStatusAndId.getDevStatusId();
            if (type.equals("dev_temperature")){
                devStatusMap.put(devStatusAndId.getDevStatus().getUploadTime(),devStatusAndId.getDevStatus().getDevTemperature());
            } else if (type.equals("dev_humidity")){
                devStatusMap.put(devStatusAndId.getDevStatus().getUploadTime(),devStatusAndId.getDevStatus().getDevHumidity());
            }else {
                devStatusMap.put(devStatusAndId.getDevStatus().getUploadTime(),devStatusAndId.getDevStatus().getDevLevel());
            }
        }
        return devStatusMap;
    }

    public DevStatusAndId CheckZero(String devId, Integer devStatusId){
        DevStatus devStatus=deviceMapper.getDevLastStatusMapByDevStatusId(devId,devStatusId);
        return devStatus==null?CheckZero(devId,devStatusId-1):new DevStatusAndId(devStatus,devStatusId-1);
    }

    public LinkedHashMap<Date,String> CheckZero2(String devId, Integer devStatusId,String type){
        DevStatus devStatus=deviceMapper.getDevLastStatusMapByDevStatusId(devId,devStatusId);
        if (devStatus==null) {
            return CheckZero2(devId,devStatusId-1,type);
        }else {
            LinkedHashMap<Date,String> middle=new LinkedHashMap<>();
            middle.put(devStatus.getUploadTime(),deviceMapper.getDevLastXXXStatusMapByDevStatusId(devId,devStatusId-1,type));
            return middle;
        }
    }

    public String formatDevId(String devId){
        String[] strings = devId.split("-");
        String devOnceId="";
        for (String string : strings) {
            devOnceId+=string;
        }
        return devOnceId;
    }

    @Override
    public ArrayList<String> getDevIdByReason(String findReason) {
        String[] arrStr=findReason.split("·");
        String devId="%";
        String position="%";
        if (arrStr.length==1){
            devId="%"+arrStr[0]+"%";
        }else if (arrStr.length==2){
            devId="%"+arrStr[0]+"%";
            position="%"+arrStr[1]+"%";
        }
        return deviceMapper.getDevIdByReason(devId,position);
    }

    @Override
    public ArrayList<DevStatus> getAllDevStatusByReason(String findReason) {
        ArrayList<DevStatus> devStatuses=new ArrayList<>();
        ArrayList<String> devIds=getDevIdByReason(findReason);
        for (String devId: devIds) {
            devStatuses.add(deviceMapper.getDevLastStatus(formatDevId(devId)));
        }
        return devStatuses;
    }

    @Override
    public ArrayList<String> getAllDevId() {
        return deviceMapper.getAllDevId();
    }

    @Override
    public ArrayList<String> getAllPosition() {
        return deviceMapper.getAllPosition();
    }

    @Override
    public ArrayList<Device> getAllDevInitStatus() {
        return deviceMapper.getAllDevInitStatus();
    }

}
