package kr.co.itfact.util;

import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;

public class ConvertUtils {
	public static byte[] toUTF8(byte[] datas) {
		Charset utf8 = Charset.forName("UTF-8");
		Charset euckr = Charset.forName("EUC-KR");
		
		ByteBuffer bBuffer = ByteBuffer.wrap(datas);
		CharBuffer cBuffer = euckr.decode(bBuffer);
		
		return utf8.encode(cBuffer).array();
	}
	
	public static byte[] toEUCKR(byte[] datas) {
		Charset utf8 = Charset.forName("UTF-8");
		Charset euckr = Charset.forName("EUC-KR");
		
		ByteBuffer bBuffer = ByteBuffer.wrap(datas);
		CharBuffer cBuffer = utf8.decode(bBuffer);
		
		return euckr.encode(cBuffer).array();
	}
}
