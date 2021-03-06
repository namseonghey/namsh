/******************************************************************************************************
* @파일명		: kr.co.itfact.scrm.dao.DefaultDAOImpl.java
* @목적			: DB 처리 DAO 파일
* @상위파일		:
					- kr.co.itfact.scrm.service.DefaultService.java
 					- kr.co.itfact.scrm.service.DefaultServiceImpl.java
* @하위파일		:				 
* @플로우		: DB 처리 DAO 파일
* @검수			: 
* @작성자		: choi woo keun
* @생성일		: 2013.10.07
* @수정이력
-----------------------------------------------------------------------------
No.		일자				수정자			설명
-----------------------------------------------------------------------------
1		 2013.11.28 	lee jeong gon	주석 수정
******************************************************************************************************/
package kr.co.itfact.scrm.dao;

import java.util.HashMap;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import kr.co.itfact.scrm.json.handler.CryptoHandler;

@Component("secondaryDAO")
public class SecondaryDAOImpl implements DefaultDAO {
	@Autowired
	@Qualifier("sqlSessionSecondary")
	private SqlSessionTemplate template;
	
	@Autowired
	private CryptoHandler cryptor;
	
	public Object serviceCreate(String statementName, HashMap<String, Object> parameterMap) {
		return template.insert(statementName, doFilter(parameterMap));
	}
	
	public int serviceUpdate(String statementName, HashMap<String, Object> parameterMap) {
		return template.update(statementName, doFilter(parameterMap));
	}
	
	public int serviceDestroy(String statementName, HashMap<String, Object> parameterMap) {
		return template.delete(statementName, doFilter(parameterMap));
	}
	
	public List<HashMap<String, Object>> serviceRead(String statementName, HashMap<String, Object> parameterMap) {
		return cryptor.decrypt(template.selectList(statementName, doFilter(parameterMap)));
	}
	
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
	
	public void encrypt(HashMap<String, Object> record) {
		cryptor.encrypt(record);
	}
}
