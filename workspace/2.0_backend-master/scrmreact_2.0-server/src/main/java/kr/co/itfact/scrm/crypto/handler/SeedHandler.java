package kr.co.itfact.scrm.crypto.handler;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.ibm.icu.impl.number.parse.UnicodeSetStaticCache.Key;

import kr.co.itfact.scrm.common.DefaultConstants;
import kr.co.itfact.util.StringUtils;
import kr.co.itfact.zeus.common.util.StringUtil;
import kr.co.itfact.zeus.crypto.CryptoException;
import kr.co.itfact.zeus.crypto.seed.Decryptor;
import kr.co.itfact.zeus.crypto.seed.Encryptor;

@Component
public class SeedHandler {
	@Autowired
	private Environment env;
	
	private static final String SEED_PREFIX = "crypto.seed.scrmreact";
	private static final String CRYPTO_WAY_FILE = "file";
	private static final String CRYPTO_WAY_STRING = "string";
	
	private String strSysDv = null;
	private Encryptor encryptor = null;
	private Decryptor decryptor = null;
	
	public void setSysDv(String strSysDv) {
		switch (strSysDv) {
		case DefaultConstants.SERVER_PROD:
			this.strSysDv = DefaultConstants.SUBFIX_PROD;
			break;
		case DefaultConstants.SERVER_DEV:
			this.strSysDv = DefaultConstants.SUBFIX_DEV;
			break;
		default:
			this.strSysDv = DefaultConstants.SUBFIX_LOCAL;
			break;
		}
	}
	
	private void setEncryptor() {
		if (this.encryptor == null) {
			this.encryptor = new Encryptor();
		}
	}
	
	private void setDecryptor() {
		if (this.decryptor == null) {
			this.decryptor = new Decryptor();
		}
	}
	
	public String getKeyPath(String prefix) {
		StringBuffer path = new StringBuffer();
		path.append(prefix);
		path.append(".path.");
		path.append(this.strSysDv);
		
		return env.getProperty(path.toString());
	}
	public String getSeedKeyName(String prefix) {
		StringBuffer key = new StringBuffer();
		key.append(prefix);
		key.append(".name.");
		key.append(this.strSysDv);
		
		return env.getProperty(key.toString());
	}
	public String getSeedKeyString(String prefix) {
		StringBuffer key = new StringBuffer();
		key.append(prefix);
		key.append(".string.");
		key.append(this.strSysDv);
		
		return env.getProperty(key.toString());
	}
	
	public String getSeedWay(String prefix) {
		StringBuffer key = new StringBuffer();
		key.append(prefix);
		key.append(".way");
		
		return env.getProperty(key.toString());
	}
	
	public byte[] encrypt(String dec) throws CryptoException, UnsupportedEncodingException {
		return this.encrypt(dec, SeedHandler.SEED_PREFIX);
	}
	
	public byte[] encrypt(String dec, String prefix) throws CryptoException, UnsupportedEncodingException {
		this.setEncryptor();
		byte[] encs = null;
		
		switch (this.getSeedWay(prefix)) {
		case SeedHandler.CRYPTO_WAY_FILE:
			encs = this.encryptor.encrypt(dec.getBytes(), this.getKeyPath(prefix), this.getSeedKeyName(prefix));
			break;
		case SeedHandler.CRYPTO_WAY_STRING:
		default:
			encs = this.encryptor.encrypt(dec.getBytes("EUC-KR"), this.getSeedKeyString(prefix));
			break;
		}
		
		return encs;
	}
	
	public String decrypt(String enc) throws CryptoException, UnsupportedEncodingException {
		return this.decrypt(enc.getBytes(), SeedHandler.SEED_PREFIX);
	}
	
	public String decrypt(byte[] enc, String prefix) throws CryptoException, UnsupportedEncodingException {
		this.setDecryptor();
		byte[] decs = null;
		
		switch (this.getSeedWay(prefix)) {
		case SeedHandler.CRYPTO_WAY_FILE:
			decs = this.decryptor.decrypt(enc, this.getKeyPath(prefix), this.getSeedKeyName(prefix));
			break;
		case SeedHandler.CRYPTO_WAY_STRING:
		default:
			decs = this.decryptor.decrypt(StringUtils.hexToBytes(new String(enc)), this.getSeedKeyString(prefix));
			break;
		}
		
		return new String(decs, "EUC-KR");
	}
}
