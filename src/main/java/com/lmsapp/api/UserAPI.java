package com.lmsapp.api;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.SQLException;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsapp.pojo.Admin;
import com.lmsapp.pojo.User;
import com.lmsapp.service.UserService;
import com.lmsapp.service.UserServiceProvider;
import com.lmsapp.util.LMSResponse;

@Path("/")
public class UserAPI {
	
	UserService userService = new UserServiceProvider();
	
	@POST
	@Path("/signup")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String signUp(String inputjson) throws JsonMappingException, JsonProcessingException, SQLException {
		ObjectMapper mapper = new ObjectMapper();
		User user = mapper.readValue(inputjson, User.class);
		userService.saveUser(user);
		User result = userService.getUserByMail(user.getEmailid());
		LMSResponse response = null;
		if(result!=null) {
			response = new LMSResponse(true, "Sucess", result);
		}else {
			response = new LMSResponse(false, "Failed", result);
		}
		return mapper.writeValueAsString(response);
	}
	
	@POST
	@Path("/login")
	public String login(String inputjson) throws JsonProcessingException, SQLException {
		System.out.println(inputjson);
		JSONObject jsonObject = new JSONObject(inputjson);
		String emailid = jsonObject.getString("username");
		String password = jsonObject.getString("password");
		User result = userService.login(emailid, password);
		LMSResponse response = null;
		if(result!=null) {
			response = new LMSResponse(true, "Sucess", result);
		}else {
			response = new LMSResponse(false, "Failed", result);
		}
		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(response);
	}
	
	@POST
	@Path("/uploadFile")
	public String uploadFile(File file) throws FileNotFoundException, IOException {
		System.out.println(file.getTotalSpace());
		String outputFilePath = "D:\\lms\\lms\\lmsapp\\src\\main\\resources\\uploads\\test.pdf";
		File outputFile = new File(outputFilePath);
		
		try (FileInputStream inputStream = new FileInputStream(file);
				FileOutputStream outputStream = new FileOutputStream(outputFile)) {
			// Read bytes from the temporary file and write them to the output file
			byte[] buffer = new

			byte[1024];
			int bytesRead;
			while ((bytesRead = inputStream.read(buffer)) != -1) {
				outputStream.write(buffer, 0, bytesRead);
			}

			System.out.println("PDF file copied successfully!");
		}
	    return "success";
	}
	
	@POST
	@Path("/createAdmin")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public LMSResponse createAdmin(String inputjson) throws JsonMappingException, JsonProcessingException, SQLException {
		JSONObject jsonObject = new JSONObject(inputjson);
		String name = jsonObject.getString("name");
		String emailid = jsonObject.getString("emailid");
		String phone = jsonObject.getString("phone");
		
		User user = new User();
		user.setEmailid(emailid);
		user.setPhone(phone);
		user.setPassword("1234567890");
		user.setUsertype(jsonObject.getString("usertype"));
		userService.saveUser(user);
		User result = userService.getUserByMail(user.getEmailid());
		
		Admin admin = new Admin();
		admin.setName(name);
		admin.setUser(result);
		
		LMSResponse res = userService.createUserAdmin(result, admin);
		return res;
	}
}
