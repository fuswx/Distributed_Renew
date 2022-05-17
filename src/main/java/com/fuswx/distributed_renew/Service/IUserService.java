package com.fuswx.distributed_renew.Service;

import com.fuswx.distributed_renew.Bean.User;

public interface IUserService {

    User findUserByUP(String userName,String password);
}
