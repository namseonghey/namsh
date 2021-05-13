/******************************************************************************************************
* @파일명		: kr.co.itfact.scrm.util.StringUtils.java
* @목적			: String Util
* @상위파일		: 
* @하위파일		: 
* @플로우		: 
*					1. XSSFilter(String)
*					 - Cross-site script 관련 필터 (전체)
*					 - 전체 일괄 REPLACE
*					2 .XSSFilter(String,String)
*					 - Cross-site script 관련 제외필터 (제외 항목 선택)
*					 - sParam 유형 : A(&), L(<), G(>), D("), S('), P(%)
*					 - Example     : XXFilter(ss,"PA") ;
*					3. SQLInjectionFilter(String)
*					 - SqlInjection script 관련 필터 (전체)
*					 - 전체 일괄 REPLACE
*					4 .SQLInjectionFilter(String,String)
*					 - SqlInjection script 관련 제외필터 (제외 항목 선택)
*					 - sParam 유형 : O(or), A(and), S(select), D(delete), I(insert) ,
*                					1(;) , 2(:)  , 3(--), 4(\\)
* @검수			: 
* @작성자		: choi woo keun
* @생성일		: 2013.10.07
* @수정이력
-----------------------------------------------------------------------------
No.		일자				수정자			설명
-----------------------------------------------------------------------------
1		 2013.11.28 	lee jeong gon	주석 수정
******************************************************************************************************/
package kr.co.itfact.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Clob;
import java.sql.SQLException;

public class StringUtils extends org.apache.commons.lang3.StringUtils  {
	// Cross-site script 관련 필터 (전체)
	public static String XSSFilter (Object sInvalid) {
		String sValid = (String)sInvalid;
		if (sValid == null || sValid.equals("")) { return ""; }
		
		sValid = sValid.replaceAll("&", "&amp;");
		sValid = sValid.replaceAll("<", "&lt;");
		sValid = sValid.replaceAll(">", "&gt;");
		sValid = sValid.replaceAll("\"", "&qout;");
		sValid = sValid.replaceAll("\'", "&#039;");
		sValid = sValid.replaceAll("%", "");
		
		return sValid;
	}
	
	// Cross-site script 관련 필터 (선택),  sExt 유형 : A(&), L(<), G(>), D("), S('), P(%), Z(Nothing)
	public static String XSSFilter (Object sInvalid, String sParam) {
		String sValid = (String)sInvalid;
		int isChecked = 0;
		
		String sPattern = "ALGDSPZ" ;
		String sExt = "" ;
		
		if (sValid == null || sValid.equals("")) return "";
		if (sParam == null || sParam.equals("")) return XSSFilter(sInvalid);
		
		for (int i=0;i<sPattern.length();i++) {
			if (sParam.indexOf(sPattern.charAt(i)) == -1) {
				sExt = sExt + sPattern.substring(i,i+1);
			}
		}
		
		for (int i=0;i<sExt.length();i++) {
			if (sExt.toUpperCase().charAt(i)=='A') {
				sValid = sValid.replaceAll("&", "&amp;");
				isChecked=1 ;
			} else if (sExt.toUpperCase().charAt(i)=='L') {
				sValid = sValid.replaceAll("<", "&lt;");
				isChecked=1 ;
			} else if (sExt.toUpperCase().charAt(i)=='G') {
				sValid = sValid.replaceAll(">", "&gt;");
				isChecked=1 ;
			} else if (sExt.toUpperCase().charAt(i)=='D') {
				sValid = sValid.replaceAll("\"", "&qout;");
				isChecked=1 ;
			} else if (sExt.toUpperCase().charAt(i)=='S') {
				sValid = sValid.replaceAll("\'", "&#039;");
				isChecked=1 ;
			} else if (sExt.toUpperCase().charAt(i)=='P') {
				sValid = sValid.replaceAll("%", "");
				isChecked=1 ;
			} else if (sExt.toUpperCase().charAt(i)=='Z') {
				isChecked=1 ;
			} 
		}
		
		if (isChecked==0) return XSSFilter(sInvalid);
		
		return sValid;
	}
	
	// SqlInjection script 관련 필터 (전체)
	public static String SQLInjectionFilter (Object sInvalid) {
		String sValid = (String)sInvalid;
		if (sValid == null || sValid.equals("")) return "";
		
		sValid = sValid.replaceAll(" (?i)or ", "");
		sValid = sValid.replaceAll(" (?i)and ", "");
		sValid = sValid.replaceAll(" (?i)select ", "");
		sValid = sValid.replaceAll(" (?i)delete ", "");
		sValid = sValid.replaceAll(" (?i)insert ","");
		
		// 이함수는 제외 한다. (사유 : 웹켄트 입력시 & , < > 의 변환문자 손상 
		//sValid = sValid.replaceAll(";", "");
		sValid = sValid.replaceAll(":", "");
		sValid = sValid.replaceAll("--", "");
		sValid = sValid.replaceAll("\\\\", "");
		
		return sValid;
	}
	
	// SqlInjection script 관련 필터 (선택),  
	//  sExt 유형 : O(or), A(and), S(select), D(delete), I(insert) , Z(Nothing)
	//              1(;) , 2(:)  , 3(--), 4(\\)
	public static String SQLInjectionFilter (Object sInvalid,String sParam) {
		String sValid = (String)sInvalid;
		int isChecked = 0;
		
		String sPattern = "OASDI1234Z" ;
		String sExt = "" ;
		
		if (sValid == null || sValid.equals("")) return "";
		if (sParam == null || sParam.equals("")) return SQLInjectionFilter(sInvalid);
		
		for (int i = 0; i < sPattern.length(); i++) {
			if (sParam.indexOf(sPattern.charAt(i)) == -1) {
				sExt = sExt + sPattern.substring(i,i + 1);
			}
		}
		
		for (int i = 0; i < sExt.length(); i++) {
			if (sExt.toUpperCase().charAt(i) == 'O') {
				sValid = sValid.replaceAll(" (?i)or ", "");
				isChecked=1;
			} else if (sExt.toUpperCase().charAt(i) == 'A') {
				sValid = sValid.replaceAll(" (?i)and ", "");
				isChecked=1;
			} else if (sExt.toUpperCase().charAt(i) == 'S') {
				sValid = sValid.replaceAll(" (?i)select ", "");
				isChecked=1;
			} else if (sExt.toUpperCase().charAt(i) == 'D') {
				sValid = sValid.replaceAll(" (?i)delete ", "");
				isChecked=1;
			} else if (sExt.toUpperCase().charAt(i) == 'I') {
				sValid = sValid.replaceAll(" (?i)insert ","");
				isChecked=1;
			// 이함수는 제외 한다. (사유 : 웹켄트 입력시 & , < > 의 변환문자 손상 
			} else if (sExt.toUpperCase().charAt(i) == '1') {
				sValid = sValid.replaceAll(";", "");
				isChecked=1;
			} else if (sExt.toUpperCase().charAt(i) == '2') {
				sValid = sValid.replaceAll(":", "");
				isChecked=1;
			} else if(sExt.toUpperCase().charAt(i) == '3') {
				sValid = sValid.replaceAll("--", "");
				isChecked=1;
			} else if (sExt.toUpperCase().charAt(i) == '4') {
				sValid = sValid.replaceAll("\\\\", "");
				isChecked=1;
			} else if (sExt.toUpperCase().charAt(i) == 'Z') {
				isChecked=1;
			}
		}
		
		if (isChecked == 0) {
			return SQLInjectionFilter(sInvalid);
		}
		
		return sValid;
	}
	
	public static String clobToString(Clob clob) throws SQLException, IOException {
		if (clob == null) return "";
		StringBuffer out = new StringBuffer();
		String str = "";
		
		BufferedReader br = null;
		try {
			br = new BufferedReader(clob.getCharacterStream());
			while ((str = br.readLine()) != null) {
				out.append(str);
			}
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		
		return out.toString();
	}
	
	public static byte[] hexToBytes(String strHex) {
		int len = strHex.length();
		byte[] data = new byte[len / 2];
		for (int i = 0; i < len; i +=2) {
			data[i / 2] = (byte)((Character.digit(strHex.charAt(i), 16) << 4) + Character.digit(strHex.charAt(i + 1), 16));
		}
		return data;
	}
	
	public static String bytesToHex(byte[] arrBytes) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < arrBytes.length; i++) {
			sb.append(String.format("%02x ", arrBytes[i]&0xff));
		}
		return sb.toString();
	}
}

