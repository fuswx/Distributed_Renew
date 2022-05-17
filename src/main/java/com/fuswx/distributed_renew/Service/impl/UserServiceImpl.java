package com.fuswx.distributed_renew.Service.impl;

import com.fuswx.distributed_renew.Bean.User;
import com.fuswx.distributed_renew.Mapper.UserMapper;
import com.fuswx.distributed_renew.Service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public User findUserByUP(String userName,String password) {
        return userMapper.findUserByUP(userName,password);
    }
}
