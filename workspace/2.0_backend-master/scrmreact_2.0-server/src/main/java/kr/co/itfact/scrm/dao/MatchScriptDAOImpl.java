package kr.co.itfact.scrm.dao;


import org.springframework.stereotype.Component;

import com.itfact.lib.MatchScript;


@Component("MatchScriptDAO")
public class MatchScriptDAOImpl implements MatchScriptDAO{
	/*	public MatchScript mScript = MatchScript.getInstance();
	
	@Override
	public int analysisScript (String targetCd, String text) {
		
		int pass = mScript.analysisCalbot("stt", "~dltvor2009", "jdbc:mariadb://172.16.0.26:3306/smart?characterEncoding=UTF-8&serverTimezone=Asia/Seoul", "mariadb", targetCd, text);		


		return pass;
	}


	@Override
	public String parsDate(String string) {
		String parsDate =  mScript.parsDate(string);		
		return parsDate;
	}


	@Override
	public String parsTime1(String string) {
		String parsTime =  mScript.parsTime1(string);		
		return parsTime;
	}


	@Override
	public boolean analysisResult(String targetCd, String text, int sco) {
		boolean test = mScript.analysisResult("stt", "~dltvor2009", "jdbc:mariadb://172.16.0.26:3306/smart?characterEncoding=UTF-8&serverTimezone=Asia/Seoul", "mariadb", targetCd, text, sco);		

		return false;
	}

*/
}