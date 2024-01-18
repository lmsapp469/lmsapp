package com.lmsapp.db;

public interface DBService {

	public void insert(Object obj);
	public void update(Object obj);
	public Object get(Object obj, Long id);
	public Object getByQuery(String query);
	public Object getAdmin(Long id);
}
