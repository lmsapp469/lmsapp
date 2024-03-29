package com.lmsapp.service;

import java.sql.SQLException;

import com.lmsapp.pojo.Admin;
import com.lmsapp.pojo.User;
import com.lmsapp.util.LMSResponse;

public interface UserService {

	public void saveUser(User user) throws SQLException;
	public User getUser(long id);
	public User getUserByMail(String email) throws SQLException;
	public User login(String emailid, String password) throws SQLException;
	public LMSResponse createUserAdmin(User user, Admin admin) throws SQLException;
	//Hi from Nipun
}
