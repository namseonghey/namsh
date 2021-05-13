/******************************************************************************************************
* @���ϸ�		: kr.co.itfact.scrm.dao.DefaultDAOImpl.java
* @����			: DB ó�� DAO ����
* @��������		:
					- kr.co.itfact.scrm.service.DefaultService.java
 					- kr.co.itfact.scrm.service.DefaultServiceImpl.java
* @��������		:				 
* @�÷ο�		: DB ó�� DAO ����
* @�˼�			: 
* @�ۼ���		: choi woo keun
* @������		: 2013.10.07
* @�����̷�
-----------------------------------------------------------------------------
No.		����				������			����
-----------------------------------------------------------------------------
1		 2013.11.28 	lee jeong gon	�ּ� ����
******************************************************************************************************/
package kr.co.itfact.scrm.dao;

import java.util.HashMap;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import kr.co.itfact.scrm.json.handler.CryptoHandler;

@Component("primaryDAO")
public class PrimaryDAOImpl implements DefaultDAO {
	@Autowired
	@Qualifier("sqlSessionPrimary")
	private SqlSessionTemplate template;
	
	@Autowired
	private CryptoHandler cryptor;
	
	@Override
	public Object serviceCreate(String statementName, HashMap<String, Object> parameterMap) {
		return template.insert(statementName, doFilter(parameterMap));
	}
	
	@Override
	public int serviceUpdate(String statementName, HashMap<String, Object> parameterMap) {
		return template.update(statementName, doFilter(parameterMap));
	}
	
	@Override
	public int serviceDestroy(String statementName, HashMap<String, Object> parameterMap) {
		return template.delete(statementName, doFilter(parameterMap));
	}
	
	@Override
	public List<HashMap<String, Object>> serviceRead(String statementName, HashMap<String, Object> parameterMap) {
		return cryptor.decrypt(this.convertClobs(template.selectList(statementName, doFilter(parameterMap))));
	}
	
	@Override
	public String serviceRreadString(String statementName, HashMap<String, Object> parameterMap) {
		return (String)template.selectOne(statementName, doFilter(parameterMap));
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<HashMap<String, Object>> serviceProcedure(String statementName, HashMap<String, Object> parameterMap) {
		HashMap<String, Object> param = doFilter(parameterMap);
		template.selectList(statementName, param);
		List<HashMap<String, Object>> list = (List<HashMap<String, Object>>) param.get("RESULTS");
		return cryptor.decrypt(list);
	}
	
	@Override
	public void encrypt(HashMap<String, Object> record) {
		cryptor.encrypt(record);
	}
}
