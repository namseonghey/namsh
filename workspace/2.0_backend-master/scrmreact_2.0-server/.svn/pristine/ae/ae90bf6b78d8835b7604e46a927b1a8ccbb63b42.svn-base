/******************************************************************************************************
 * @파일명		: kr.co.itfact.scrm.common.DefaultConstants.java
 * @목적			: 공통 상수 정의
 * @상위파일	: 
 * @하위파일	: 
 * @플로우		: 
 * @검수			: 
 * @작성자		: lee jeong gon
 * @생성일		: 2013.10.07
 * @수정이력
-----------------------------------------------------------------------------
No.		일자			수정자			설명
-----------------------------------------------------------------------------
1		 2013.11.28 	lee jeong gon	주석 수정
******************************************************************************************************/
package kr.co.itfact.scrm.common;

import java.net.InetAddress;
import java.net.UnknownHostException;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class DefaultConstants {
	private static Logger logger = LoggerFactory.getLogger(DefaultConstants.class);
	
	@Autowired
	private Environment env;
	
	public static final String CHARSET_UTF8		= "UTF-8";
	public static final String CHARSET_EUCKR	= "EUC-KR";
	
	public static final String NULL_STRING		= "";
	public static final String ZERO_STRING		= "0";
	public static final int NOT_FOUND_INDEX		= -1;
	
	public static final boolean xsFilterUse		= false;
	public static final boolean isPageUse		= true;
	
	public static final String RESULT_CD_SUCCESS= "0";		// SUCCESS
	public static final String RESULT_CD_ERROR	= "-2";		// ERROR
	public static final String RESULT_CD_UPLOAD_FAIL = "-3";// UPLOAD_FAIL
	
	public static final String QUERY_PAGING		= "1";
	public static final String QUERY_START		= "0";
	public static final String QUERY_PAGE		= "1";
	public static String QUERY_LIMIT			= "2000";
	
	private static String addr;
	public static  String HOST;
	public static final String SERVER_PROD		= "P";
	public static final String SERVER_DEV		= "D";
	public static final String SERVER_LOCAL		= "L";
	
	public static String SUBFIX_PROPERTY;
	public static final String SUBFIX_PROD		= "prod";
	public static final String SUBFIX_DEV		= "dev";
	public static final String SUBFIX_LOCAL		= "local";
	
	public static final String PROTOCOL_HTTP	= "http://";
	public static final String PROTOCOL_HTTPS	= "https://";
	
	//------------------------------------------------------------------
	// [server area]
	//------------------------------------------------------------------
	// server group
	public static final int SERVER_GROUP_LOCAL		= 0;
	public static final int SERVER_GROUP_TEST		= 1;
	public static final int SERVER_GROUP_PROD		= 2;
	
	// WAS Name define
	public static final int SERVER_IPADR_LOCAL		= 0;	
	
	// WAS IP Address define
	/**
	 * ARR_SERVER_IP[0]		: SERVER_GROUP_LOCAL	: local server
	 * ARR_SERVER_IP[1]		: SERVER_GROUP_TEST		: test server ip address
	 * ARR_SERVER_IP[2]		: SERVER_GROUP_PROD		: product server ip address
	 */
	//public static String[][] ARR_SERVER_IPADR		= null;
	//public static String[][] ARR_SERVER_PORT		= null;
	
	public static int	SERVER_GROUP_IDX		= DefaultConstants.SERVER_GROUP_LOCAL;
	public static int 	SERVER_IPADR_IDX		= DefaultConstants.SERVER_IPADR_LOCAL;
	
	//------------------------------------------------------------------
	// [crypto area]
	//------------------------------------------------------------------
	public static String CRYPTO_SEED_ROOT = null;
	
	@PostConstruct
	public void init() {
		//------------------------------------------------------------------
		// initialize ip address & port
		//------------------------------------------------------------------
		/*
		DefaultConstants.ARR_SERVER_IPADR	= new String[][] {
			{ env.getProperty("server.host.local") },
			{ env.getProperty("server.host.dev") },
			{ env.getProperty("server.host.prod") }
		};
		
		DefaultConstants.ARR_SERVER_PORT = new String[][] {
			{ env.getProperty("server.port.local") },
			{ env.getProperty("server.port.dev") },
			{ env.getProperty("server.port.prod") }
		};
		*/
		//------------------------------------------------------------------
		// setting current ip address
		//------------------------------------------------------------------
		/*
		try {
			DefaultConstants.ARR_SERVER_IPADR[DefaultConstants.SERVER_GROUP_LOCAL][0] = InetAddress.getLocalHost().getHostAddress();
			System.out.println("WAS_IP :: " + DefaultConstants.ARR_SERVER_IPADR[DefaultConstants.SERVER_GROUP_LOCAL][0]);
		} catch (UnknownHostException e) {
			throw new RuntimeException(e);
		}*/
		
		/*
		for (int intLoopA = 1; intLoopA < DefaultConstants.ARR_SERVER_IPADR.length; intLoopA++) {
			for (int intLoopB = 0; intLoopB < DefaultConstants.ARR_SERVER_IPADR[intLoopA].length; intLoopB++) {
				if (DefaultConstants.ARR_SERVER_IPADR[DefaultConstants.SERVER_GROUP_LOCAL][0].equals(DefaultConstants.ARR_SERVER_IPADR[intLoopA][intLoopB])) {
					DefaultConstants.SERVER_GROUP_IDX = intLoopA;
					DefaultConstants.SERVER_IPADR_IDX = intLoopB;
					break;
				}
			}
		}*/
		
		/*
		if ( DefaultConstants.addr == null ) {
			DefaultConstants.addr = DefaultConstants.ARR_SERVER_IPADR[DefaultConstants.SERVER_GROUP_LOCAL][0];
			
			if (DefaultConstants.SERVER_GROUP_IDX == DefaultConstants.SERVER_GROUP_TEST) {
				DefaultConstants.HOST = DefaultConstants.SERVER_DEV;
				DefaultConstants.SUBFIX_PROPERTY = DefaultConstants.SUBFIX_DEV;
			} else if (DefaultConstants.SERVER_GROUP_IDX == DefaultConstants.SERVER_GROUP_PROD) {
				DefaultConstants.HOST = DefaultConstants.SERVER_PROD;
				DefaultConstants.SUBFIX_PROPERTY = DefaultConstants.SUBFIX_PROD;
			} else {
				// Developer's PC
				DefaultConstants.HOST = DefaultConstants.SERVER_LOCAL;
				DefaultConstants.SUBFIX_PROPERTY = DefaultConstants.SUBFIX_LOCAL;
			}
		}*/
		
		//------------------------------------------------------------------
		// setting paging
		//------------------------------------------------------------------
		DefaultConstants.QUERY_LIMIT = env.getProperty("page.query.limit");
		
		//------------------------------------------------------------------
		// setting crypto
		//------------------------------------------------------------------
		//DefaultConstants.CRYPTO_SEED_ROOT = env.getProperty("crypto.seed.scrmreact.path." + DefaultConstants.SUBFIX_PROPERTY);
		
		//this.printInfo();
	}
	
	private void printInfo () {
		/*
		logger.info("-----------------------------------------------------------------------------------------------------------------------");
		for (int intA=0; intA<DefaultConstants.ARR_SERVER_IPADR.length; intA++) {
			for (int intB=0; intB<DefaultConstants.ARR_SERVER_IPADR[0].length; intB++) {
				logger.info("DefaultConstants.ARR_SERVER_IPADR[" +intA+ "][" +intB+ "] :: [" + DefaultConstants.ARR_SERVER_IPADR[intA][intB] + "]");
			}
		}
		logger.info("-----------------------------------------------------------------------------------------------------------------------");
		for (int intA=0; intA<DefaultConstants.ARR_SERVER_PORT.length; intA++) {
			for (int intB=0; intB<DefaultConstants.ARR_SERVER_PORT[0].length; intB++) {
				logger.info("DefaultConstants.ARR_SERVER_PORT[" +intA+ "][" +intB+ "]  :: [" + DefaultConstants.ARR_SERVER_PORT[intA][intB] + "]");
			}
		}
		logger.info("-----------------------------------------------------------------------------------------------------------------------");
		logger.info("DefaultConstants.SERVER_GROUP_IDX       :: [" + DefaultConstants.SERVER_GROUP_IDX + "]");
		logger.info("DefaultConstants.SERVER_IPADR_IDX       :: [" + DefaultConstants.SERVER_IPADR_IDX + "]");
		logger.info("-----------------------------------------------------------------------------------------------------------------------");
		logger.info("DefaultConstants.HOST                   :: [" + DefaultConstants.HOST + "]");
		logger.info("DefaultConstants.SUBFIX_PROPERTY        :: [" + DefaultConstants.SUBFIX_PROPERTY + "]");
		logger.info("-----------------------------------------------------------------------------------------------------------------------");
		*/
	}
}
