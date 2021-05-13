package kr.co.itfact.scrm.crypto.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import kr.co.itfact.scrm.common.DefaultConstants;
import kr.co.itfact.scrm.crypto.AES256Util;
import kr.co.itfact.zeus.crypto.CryptoException;

@Component
public class AESHandler {
	private static final String KEY_PREFIX = "crypto.aes.cardif.tm.key.";
	
	@Autowired
	private Environment env;
	
	private void loadKey () {
		if (!AES256Util.isLoadParameter()) {
			AES256Util.setParameter(env.getProperty(AESHandler.KEY_PREFIX + DefaultConstants.SUBFIX_PROPERTY));
		}
	}
	
	public String encrypt(String dec) throws CryptoException {
		this.loadKey();
		return AES256Util.encrypt(dec);
	}
	
	public String decrypt(String enc) throws CryptoException {
		this.loadKey();
		return AES256Util.decrypt(enc);
	}
}
