package com.fuswx.distributed_renew.Controller;

import com.fuswx.distributed_renew.Bean.Device;
import com.fuswx.distributed_renew.Service.IDeviceService;
import com.fuswx.distributed_renew.Service.IUserService;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class PagesController {

    @Autowired
    private IDeviceService deviceService;

    @Autowired
    private IUserService userService;

    @RequestMapping(value={"/login","/toLogin"})
    public String loginPage(){
        return "/login";
    }

    @RequestMapping({"/index","/"})
    public ModelAndView mainPage(){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.addObject("devStatus",deviceService.getAllDevStatus());
        modelAndView.setViewName("/index");
        return modelAndView;
    }

    @RequestMapping("/device/history/{varName}")
    public ModelAndView history(@PathVariable("varName")String varName){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("/pages/history");
        modelAndView.addObject("pageType",varName);
        modelAndView.addObject("allDevId",deviceService.getAllDevId());
        modelAndView.addObject("allDevPosition",deviceService.getAllPosition());
        modelAndView.addObject("allDevStatus",deviceService.getAllDevStatus());
        return modelAndView;
    }
    @RequestMapping("/device/history/detail")
    public ModelAndView historyDetail(@Param(value = "devId")String devId){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("/pages/history-detail");
        modelAndView.addObject("devId",devId);
        return modelAndView;
    }
}
