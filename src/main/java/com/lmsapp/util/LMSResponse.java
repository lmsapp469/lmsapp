package com.lmsapp.util;

public class LMSResponse {

	private boolean status;
	private String message;
	private Object model;
	
	public LMSResponse() {}
	
	public LMSResponse(boolean status, String message, Object model) {
		super();
		this.status = status;
		this.message = message;
		this.model = model;
	}
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Object getModel() {
		return model;
	}
	public void setModel(Object model) {
		this.model = model;
	}
	
	
}
