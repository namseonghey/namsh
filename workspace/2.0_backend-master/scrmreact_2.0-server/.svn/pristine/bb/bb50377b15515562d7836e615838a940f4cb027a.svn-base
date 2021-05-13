package kr.co.itfact.scrm.crypto;

import java.io.UnsupportedEncodingException;
import java.security.Key;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AES256Util {
	private static final Logger logger = LoggerFactory.getLogger(AES256Util.class);
	
	private static String CHARACTER_ENCODING_UTF_8 = "UTF-8";
	
	private static byte[] parameter = null;
	private static Key key = null;
	
	public static boolean isLoadParameter() {
		boolean isLoadParameter = true;
		if (AES256Util.parameter == null) {
			isLoadParameter = false;
		}
		
		return isLoadParameter;
	}
	
	public static void setParameter(String parameter) {
		String[] parameters = parameter.replaceAll("[{]", "").replaceAll("[}]", "").replaceAll(" ", "").split("[,]");
		AES256Util.parameter = new byte[16];
		for (int intA=0; intA<parameters.length; intA++) {
			AES256Util.parameter[intA] = Byte.parseByte(parameters[intA]);
		}
	}
	
	/**
	 * 16자리의 키값을 입력하여 객체를 생성한다.
	 * @param key 암/복호화를 위한 키값
	 * @throws UnsupportedEncodingException 키값의 길이가 32이하일 경우 발생
	 * 다른 업체 이용 시 아래의 init ~ decrypt 메소드까지만생성할것
	 */
	private static void initialize() {
		if ( key == null ) {
			key = new SecretKeySpec(new byte[16], "AES");
		}
	}
	
	/**
	 * 데이터를 암호화 한다.
	 * @param decStr 암호화되지 않은 데이터
	 */
	public static String encrypt(String dec) {
		initialize();
		return encode(dec, key, parameter);
	}
	
	/**
	 * 데이터를 암호화 한다.
	 * @param encStr 암호화된 않은 데이터
	 */
	public static String decrypt(String enc) {
		initialize();
		return decode(enc, key, parameter);
	}
	
	/**
	 * AES256 으로 암호화 한다.
	 * @param str 암호화할 문자열
	 * @param secretKeySpec
	 * @param spec key의 byte값
	 */
	private static String encode(String dec, Key key, byte[] parameter) {
		if (dec == null || dec.equals("")) { return dec; }
		
		try {
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			
			cipher.init(Cipher.ENCRYPT_MODE, key, new IvParameterSpec(parameter));
			return new String(Base64.encodeBase64(cipher.doFinal(dec.getBytes(CHARACTER_ENCODING_UTF_8))));
		} catch (Exception e) {
			e.printStackTrace();
			return dec;
		}
	}
	
	/**
	 * AES256으로 암호화된 String을 복호화한다.
	 * @param str 복호화할 문자열
	 * @param secretKeySpec
	 * @param spec key의 byte값
	 */
	private static String decode(String enc, Key key, byte[] parameter) {
		if (enc == null || enc.equals("")) { return enc; }
		
		try {
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(parameter));
			return new String(cipher.doFinal(Base64.decodeBase64(enc.getBytes())), CHARACTER_ENCODING_UTF_8);
		} catch (Exception e) {
			// zeus
			
			logger.debug("AES256Util.decode Exception:: [" +enc+ "]");
			e.printStackTrace();
			return enc;
		}
	}
	
	public static void main(String[] args) {
		String aa = "8809061692439";
		
		String enc = AES256Util.encrypt(aa);
		String dec = AES256Util.decrypt(enc);
		
		System.out.println(dec);
		System.out.println(enc);
	}

}
