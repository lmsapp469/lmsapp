package com.lmsapp.service;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONObject;

import com.lmsapp.db.DBConnection;
import com.lmsapp.db.DBService;
import com.lmsapp.db.DBServiceProvider;
import com.lmsapp.pojo.Admin;
import com.lmsapp.pojo.User;
import com.lmsapp.util.LMSResponse;
import com.lmsapp.util.SQLQueries;

public class UserServiceProvider implements UserService{
	DBService dbservice = new DBServiceProvider();

	@Override
	public void saveUser(User user) {
		try {
			dbservice.insert(user);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public User getUser(long id) {
		// TODO Auto-generated method stub
		return null;
	}
	
	public static void main(String args[]) {
		DBService dbservice = new DBServiceProvider();
		String query = SQLQueries.USER_BY_EMAIL.replace("{emailid}", "lms1@gmail.com");
		try {
			User user = (User) dbservice.getByQuery(query);
			System.out.println(user.getPassword());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public User getUserByMail(String email) {
		String query = SQLQueries.USER_BY_EMAIL.replace("{emailid}", email);
		try {
			User user = (User) dbservice.getByQuery(query);
			return user;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public User login(String emailid, String password) throws SQLException {
		Connection con = DBConnection.getConnection();
		User user = null;
		try {
			String query = "select * from user where emailid='"+emailid+"' and password='"+password+"'";
			PreparedStatement ps = con.prepareStatement(query);
			ResultSet rs = ps.executeQuery();
			if(rs.next()) {
				user = new User();
				user.setUserid(rs.getInt("userid"));
				user.setEmailid(rs.getString("emailid"));
				user.setPhone(rs.getString("phone"));
				user.setPassword(rs.getString("password"));
				user.setStatus(rs.getBoolean("status"));
				user.setUsertype(rs.getString("usertype"));
			}
			ps.close();
			rs.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			con.close();
		}
		return user;
	}

	@Override
	public LMSResponse createUserAdmin(User user, Admin admin) {
		LMSResponse resp = null;
		try {
			dbservice.insert(admin);
			JSONObject json = new JSONObject();
			json.put("name", admin.getName());
			json.put("created", admin.getCreateddate());
			json.put("status", true);
			json.put("emailid", user.getEmailid());
			json.put("phone", user.getPhone());
			resp = new LMSResponse(true, "success", json);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resp;
	}

}