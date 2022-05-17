package com.fuswx.distributed_renew.Mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import com.fuswx.distributed_renew.Bean.User;

@Mapper
public interface UserMapper {

    @Select("select * from users where username=#{username} and password=#{password}")
    User findUserByUP(@Param("username") String userName, @Param("password") String password);

    @Select("select * from users where username=#{username}")
    User getUserByUserName(String username);
}
