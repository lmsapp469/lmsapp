package com.lmsapp.service;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

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
	public void saveUser(User user) throws SQLException {
		Connection con = DBConnection.getConnection();
		try {
			String query = "insert into user values(default, ?, ?, ?, ?, ?, default, default)";
			PreparedStatement ps = con.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
			ps.setString(1, user.getEmailid());
			ps.setString(2, user.getPhone());
			ps.setString(3, user.getPassword());
			ps.setBoolean(4, true);
			ps.setString(5, user.getUsertype());
			ps.execute();
			ps.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			con.close();
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
	public User getUserByMail(String email) throws SQLException {
		Connection con = DBConnection.getConnection();
		User user = null;
		try {
			String query = "select * from user where emailid='"+email+"'";
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
	public LMSResponse createUserAdmin(User user, Admin admin) throws SQLException {
		LMSResponse resp = null;
		
		Connection con = DBConnection.getConnection();
		try {
			String query = "insert into admin values(default, ?, ?, ?, default, default)";
			PreparedStatement ps = con.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
			ps.setInt(1, user.getUserid());
			ps.setString(2, admin.getName());
			ps.setString(3, admin.getDescription());
			ps.execute();
			ps.close();
		} catch (SQLException e) {
			 handleSQLException(e);
		} finally {
			con.close();
		}
		
		try {
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
	
	private void handleSQLException(SQLException e) {
        System.err.println("SQL Exception: " + e.getMessage());

        // Log the SQL state and vendor code for more information
        System.err.println("SQL State: " + e.getSQLState());
        System.err.println("Vendor Code: " + e.getErrorCode());

        // You can log additional details or take appropriate action based on your application's needs
        e.printStackTrace();
    }

}
