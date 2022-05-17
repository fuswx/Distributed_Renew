package com.fuswx.distributed_renew.Handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component("NRSCAuthenticationFailureHandler")
public class AuthenticationFailureHandler implements org.springframework.security.web.authentication.AuthenticationFailureHandler {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        //修改状态码
        //response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        //设置返回内容的数据形式和编码格式
        response.setContentType("application/json;charset=UTF-8");
        String exceptionInfo=exception.getLocalizedMessage().toLowerCase();
        //将抓到的错误信息以json数据的形式进行返回
        if ("bad credentials".equals(exceptionInfo)){
            request.setAttribute("errorInfo","用户名或密码错误");
            request.getRequestDispatcher("/toLogin").forward(request,response);
        }else if ("userdetailsservice returned null, which is an interface contract violation".equals(exceptionInfo)){
            request.setAttribute("errorInfo","用户名不存在");
            request.getRequestDispatcher("/toLogin").forward(request,response);
        }else {
            response.getWriter().write("服务器错误，请联系管理员");
        }
    }
}
