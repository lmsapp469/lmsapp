package com.lmsapp.util;

public class SQLQueries {

	//User
	public static String USER_BY_EMAIL = "FROM com.lmsapp.pojo.User u where u.emailid='{emailid}'";
	public static String USER_LOGIN = "FROM com.lmsapp.pojo.User u where u.emailid='{emailid}' and u.password='{password}'";
	
}
