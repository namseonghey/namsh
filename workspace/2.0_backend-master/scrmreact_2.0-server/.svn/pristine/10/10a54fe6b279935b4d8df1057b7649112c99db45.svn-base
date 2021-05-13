/******************************************************************************************************
* @파일명		: kr.co.itfact.scrm.common.exception.SCRMException.java
* @목적			: SCRMException 처리
* @상위파일	: 
* @하위파일	: 
* @플로우		: SCRMException 처리
* @검수			: 
* @작성자		: choi woo keun
* @생성일		: 2013.10.07
* @수정이력
-----------------------------------------------------------------------------
No.		일자			수정자			설명
-----------------------------------------------------------------------------
1		 2013.11.28 	lee jeong gon	주석 수정
******************************************************************************************************/
package kr.co.itfact.scrm.common.exception;

import java.util.Arrays;

/**	
 * SCRM exception
 * 
 * @author itfact
 *
 */
public class SCRMException extends Exception {
	private static final long serialVersionUID = 1L;
	
	public static final int INACTIVE_STATUS = 2;
	private int responseCode;
	private Object[] arguments;

	public SCRMException(){
		super();
	}

	public SCRMException(final String message){
		super(message);
	}

	public SCRMException(final String message,final Throwable cause){
		super(message, cause);
	}

	public SCRMException(final Throwable cause){
		super(cause);
	}

	public SCRMException(int c,String m,Object[] args	){
		super(m);
		this.responseCode = c;	
		this.arguments = Arrays.copyOf(args, args.length);
	}
	
	public Object[] getArguments() {
		return Arrays.copyOf(arguments, arguments.length);
	}

	public void setArguments(Object[] arguments) {
		this.arguments = Arrays.copyOf(arguments, arguments.length);
	}

	public int getResponseCode() {
		return responseCode;
	}

	public void setResponseCode(int responseCode) {
		this.responseCode = responseCode;
	}
}
