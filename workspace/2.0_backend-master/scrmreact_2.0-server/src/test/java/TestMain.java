import kr.co.itfact.util.MessageDigestUtils;
import kr.co.itfact.util.StringUtils;
import kr.co.itfact.zeus.crypto.seed.Decryptor;
import kr.co.itfact.zeus.crypto.seed.Encryptor;

public class TestMain {
	public static void main(String[] args) throws Exception {
		//String encStr = MessageDigestUtils.digest("1234");
		//System.out.println(encStr);
		
		String strPlain = "»Ì»Ì";
		
		Encryptor enc = new Encryptor();
		System.out.println(new String(enc.encryptBytes2Hex(strPlain.getBytes(), "ASDF1Q2W3E4R5T6Y7U8I")));
		System.out.println(new String(enc.encryptBytes2Hex(strPlain.getBytes("EUC-KR"), "ASDF1Q2W3E4R5T6Y7U8I")));
		System.out.println(new String(enc.encryptBytes2Hex(strPlain.getBytes("UTF-8"), "ASDF1Q2W3E4R5T6Y7U8I")));
		
		/*
		System.out.println(new String(enc.encryptBytes2Hex(strPlain.getBytes(), "ASDF1Q2W3E4R5T6Y7U8I"), "EUC-KR"));
		System.out.println(new String(enc.encryptBytes2Hex(strPlain.getBytes("EUC-KR"), "ASDF1Q2W3E4R5T6Y7U8I"), "EUC-KR"));
		System.out.println(new String(enc.encryptBytes2Hex(strPlain.getBytes("UTF-8"), "ASDF1Q2W3E4R5T6Y7U8I"), "EUC-KR"));
		
		System.out.println(new String(enc.encryptBytes2Hex(strPlain.getBytes(), "ASDF1Q2W3E4R5T6Y7U8I"), "UTF-8"));
		System.out.println(new String(enc.encryptBytes2Hex(strPlain.getBytes("EUC-KR"), "ASDF1Q2W3E4R5T6Y7U8I"), "UTF-8"));
		System.out.println(new String(enc.encryptBytes2Hex(strPlain.getBytes("UTF-8"), "ASDF1Q2W3E4R5T6Y7U8I"), "UTF-8"));
		*/
		
		String strEnc = "092D5251855C425DB5D6A77D96472785";
		
		Decryptor dec = new Decryptor();
		//System.out.println(new String(dec.decryptHex2Bytes(strEnc, "ASDF1Q2W3E4R5T6Y7U8I")));
		//System.out.println(new String(dec.decryptHex2Bytes(strEnc, "ASDF1Q2W3E4R5T6Y7U8I"), "EUC-KR"));
		//System.out.println(new String(dec.decryptHex2Bytes(strEnc, "ASDF1Q2W3E4R5T6Y7U8I"), "UTF-8"));
		System.out.println(new String(dec.decrypt(StringUtils.hexToBytes(strEnc), "ASDF1Q2W3E4R5T6Y7U8I")));
		System.out.println(new String(dec.decrypt(StringUtils.hexToBytes(strEnc), "ASDF1Q2W3E4R5T6Y7U8I"), "EUC-KR"));
		System.out.println(new String(dec.decrypt(StringUtils.hexToBytes(strEnc), "ASDF1Q2W3E4R5T6Y7U8I"), "UTF-8"));
	}
}
