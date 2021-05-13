/******************************************************************************************************
* @���ϸ�		: kr.co.itfact.scrm.dao.DefaultDAO.java
* @����			: DB ó�� DAO interface ����
* @��������		:
					- kr.co.itfact.scrm.service.DefaultService.java
 					- kr.co.itfact.scrm.service.DefaultServiceImpl.java
* @��������		: 
* @�÷ο�		: DB ó�� DAO interface ����
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

import java.io.IOException;
import java.io.Reader;
import java.io.StringWriter;
import java.sql.Clob;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;

import kr.co.itfact.scrm.common.DefaultConstants;
import kr.co.itfact.util.StringUtils;

public interface DefaultDAO {
	public Object serviceCreate(String statementName, HashMap<String, Object> parameterMap);

	public int serviceUpdate(String statementName, HashMap<String, Object> parameterMap);

	public int serviceDestroy(String statementName, HashMap<String, Object> parameterMap);

	public List<HashMap<String, Object>> serviceRead(String statementName, HashMap<String, Object> parameterMap);
	
	public String serviceRreadString(String statementName, HashMap<String, Object> parameterMap);
	
	public List<HashMap<String, Object>> serviceProcedure(String statementName, HashMap<String, Object> parameterMap);
	
	public void encrypt(HashMap<String, Object> record);
	
	@SuppressWarnings("unchecked")
	default HashMap<String, Object> doFilter(HashMap<String, Object> record) {
		HashMap<String, Object> target = (HashMap<String, Object>) record.clone();
		
		addPaging(target);
		convertXSS(target);
		encrypt(target);
		
		return target;
	}
	
	default void addPaging(HashMap<String, Object> target) {
		if(DefaultConstants.isPageUse){
			if (target != null) {
				if (target.get("QUERY_PAGING") == null) target.put("QUERY_PAGING", DefaultConstants.QUERY_PAGING);
				if (target.get("QUERY_START")  == null) target.put("QUERY_START", Integer.parseInt(DefaultConstants.QUERY_START));
				if (target.get("QUERY_LIMIT")  == null) target.put("QUERY_LIMIT", Integer.parseInt(DefaultConstants.QUERY_LIMIT));
				if (target.get("QUERY_PAGE")   == null) target.put("QUERY_PAGE", DefaultConstants.QUERY_PAGE);
			} else {
				if (target.get("QUERY_START")  != null) target.put("QUERY_START", Integer.parseInt(target.get("QUERY_START").toString()));
				if (target.get("QUERY_LIMIT")  != null) target.put("QUERY_LIMIT", Integer.parseInt(target.get("QUERY_LIMIT").toString()));
			}
		}
	}
	
	default void convertXSS(HashMap<String, Object> target) {
		for (Map.Entry<String, Object> entry: target.entrySet()) {
			if (entry.getValue() != null) {
				if(DefaultConstants.xsFilterUse){
					entry.setValue(StringUtils.XSSFilter(entry.getValue().toString()));
				}
			}
		}
	}
	
	default List<HashMap<String, Object>> convertClobs(List<HashMap<String, Object>> targets) {
		for (int intA=0; intA<targets.size(); intA++) {
			this.convertClob(targets.get(intA));
		}
		
		return targets;
	}
	
	default void convertClob(HashMap<String, Object> target) {
		for (Map.Entry<String, Object> entry: target.entrySet()) {
			if (entry.getValue() instanceof Clob) {
				entry.setValue(this.clob2string((Clob)entry.getValue()));
			}
		}
	}
	
	default String clob2string(Clob clob) {
		String value = "";
		Reader reader = null;
		StringWriter writer = null;
		try {
			if (clob != null) {
				reader = clob.getCharacterStream();
				writer = new StringWriter();
				IOUtils.copy(reader, writer);
				value = writer.toString();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return value;
	}
}
