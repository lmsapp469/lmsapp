package com.lmsapp.db;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import com.lmsapp.hibernate.SessionFactoryProvider;
import com.lmsapp.pojo.Admin;

public class DBServiceProvider implements DBService{

	@Override
	public void insert(Object obj) {
		try(Session session = SessionFactoryProvider.provideSessionFactory().openSession()) {
	        Transaction t=session.beginTransaction(); 
	        session.save(obj);
	        t.commit(); 
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void update(Object obj) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Object getByQuery(String query) {
		SessionFactory sessionFactory=SessionFactoryProvider.provideSessionFactory(); 
        Session session=sessionFactory.openSession(); 
          
        Query qry=session.createQuery(query);
        List list = qry.list();
        sessionFactory.close();
        if(list.size()>0) {
        	return list.get(0);
        }
        return null;
	}

	@Override
	public Object get(Object obj, Long id) {
		SessionFactory sessionFactory=SessionFactoryProvider.provideSessionFactory(); 
        Session session=sessionFactory.openSession(); 
        Transaction t=session.beginTransaction(); 
        //session.save(obj);
        Object savedObject = session.get(Object.class, id);
        t.commit(); 
        sessionFactory.close();
        return savedObject;
	}
	
	@Override
	public Object getAdmin(Long id) {
		SessionFactory sessionFactory=SessionFactoryProvider.provideSessionFactory(); 
        Session session=sessionFactory.openSession(); 
        Transaction t=session.beginTransaction(); 
        //session.save(obj);
        Admin savedObject = session.get(Admin.class, id);
        t.commit(); 
        sessionFactory.close();
        return savedObject;
	}

}
