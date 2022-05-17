package com.fuswx.distributed_renew.Config;

import com.fuswx.distributed_renew.Handler.AuthenticationFailureHandler;
import com.fuswx.distributed_renew.Service.impl.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AuthenticationFailureHandler NRSCAuthenticationFailureHandler;

    //授权
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //请求授权的规则
        http.authorizeRequests()
                .antMatchers("/toLogin").permitAll()
                .antMatchers("/account/**","/").authenticated();

        //没有授权默认会到登录页面 /login
        http.formLogin().
                loginPage("/toLogin").
                loginProcessingUrl("/login").
                usernameParameter("userName").
                passwordParameter("password").
                failureHandler(NRSCAuthenticationFailureHandler);

        //关闭csrf，防止登出失败
        http.csrf().disable();
        //配置登出规则
        http.logout().logoutSuccessUrl("/toLogin");//登出后跳回首页

        //开启记住我功能
        http.rememberMe().rememberMeParameter("remember");

    }

    //认证
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    //在这里完成获得数据库中的用户信息
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(new BCryptPasswordEncoder());
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("static/**");
    }
}
