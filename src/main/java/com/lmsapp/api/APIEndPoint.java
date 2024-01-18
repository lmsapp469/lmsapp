package com.lmsapp.api;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.lmsapp.pojo.User;

@Path("/test")
public class APIEndPoint {

	@GET
	@Path("/sayHi")
	@Produces(MediaType.TEXT_PLAIN)
	public String sayHi() {
		return "Hey Welcome";
	}

	@POST
	@Path("/signUp")
	public User signUp(String inputjson) {
		return null;

	}

	@POST
	@Path("/signIn")
	public String signIn(String inputjson) {
		
		return "Signin";
	}
}

