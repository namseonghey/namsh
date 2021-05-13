package kr.co.itfact.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * One-way encryption
 * @author choi woo keun
 * @since 2016.06.30
 */
public class MessageDigestUtils {
	public static final String SHA_224 = "SHA-224";
	public static final String SHA_256 = "SHA-256";
	public static final String SHA_384 = "SHA-384";
	public static final String SHA_512 = "SHA-512";
	
	/**
	 * constructor
	 */
	public MessageDigestUtils() {}
	
	/**
	 * apply the default mode message digest (SHA-256)
	 * @param source target string
	 * @return Hex format string
	 * @throws NoSuchAlgorithmException
	 */
	public static String digest(String source) throws NoSuchAlgorithmException {
		return digest(source, MessageDigestUtils.SHA_256);
	}
	
	/**
	 * apply a user-defined mode message digest
	 * @param source target string
	 * @param mode with SHA-224, SHA-256, SHA-384, SHA-512 ( ex : MessageDigestUtils.SHA_224 )
	 * @return Hex format string
	 * @throws NoSuchAlgorithmException 
	 */
	public static String digest(String source, String mode) throws NoSuchAlgorithmException {
		MessageDigest md = MessageDigest.getInstance(mode);
		md.update(source.getBytes());
		byte[] digest = md.digest();
		
		return convertByte2HexString(digest);
	}
	
	/**
	 * convert byte to hex string
	 * @param digest byte array
	 * @return Hex format string
	 */
	private static String convertByte2HexString(byte[] digest) {
		StringBuffer sb = new StringBuffer();
		for (int intA=0; intA<digest.length; intA++) {
			sb.append(Integer.toString( (digest[intA] & 0xff ) + 0x100, 16 ).substring(1) );
		}
		return sb.toString();
	}
}
