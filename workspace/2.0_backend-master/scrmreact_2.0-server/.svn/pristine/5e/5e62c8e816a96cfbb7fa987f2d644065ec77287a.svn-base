package kr.co.itfact.scrm.json.handler;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import kr.co.itfact.scrm.crypto.handler.AESHandler;
import kr.co.itfact.scrm.crypto.handler.SeedHandler;
import kr.co.itfact.scrm.json.dataset.ConfigDataSet;
import kr.co.itfact.zeus.crypto.CryptoException;

@Component
public class CryptoHandler {
	@Autowired
	private SeedHandler cryptor;
	//private AESHandler cryptor;
	
	private String strSysDv = null;
	
	public HashMap<String, Object> encrypt(HashMap<String, Object> record) {
		if (record != null) {
			this.strSysDv = record.get("G_SYS_DV").toString();
			for (Map.Entry<String, Object> entry: record.entrySet()) {
				if (entry.getValue() != null) {
					if (entry.getKey().startsWith(ConfigDataSet.PREFIX_ENCRYPT) && entry.getValue() instanceof String) {
						try {
							cryptor.setSysDv(this.strSysDv);
							entry.setValue(cryptor.encrypt(entry.getValue().toString()));
						} catch (CryptoException e) {
							entry.setValue(e.getMessage());
						} catch (UnsupportedEncodingException e) {
							entry.setValue(e.getMessage());
						} catch (Exception e) {
							entry.setValue(e.getMessage());
						}
					}
				}
			}
		}
		
		return record;
	}
	
	public List<HashMap<String, Object>> encrypt(List<HashMap<String, Object>> targets) {
		for (int intA=0; intA<targets.size(); intA++) {
			this.encrypt(targets.get(intA));
		}
		
		return targets;
	}
	
	public HashMap<String, Object> decrypt(HashMap<String, Object> record) {
		if (record != null) {
			for (Map.Entry<String, Object> entry: record.entrySet()) {
				if (entry.getValue() != null) {
					if (entry.getKey().startsWith(ConfigDataSet.PREFIX_ENCRYPT) && entry.getValue() instanceof String) {
						try {
							cryptor.setSysDv(this.strSysDv);
							entry.setValue(cryptor.decrypt(entry.getValue().toString()));
						} catch (CryptoException e) {
							entry.setValue(e.getMessage());
						} catch (UnsupportedEncodingException e) {
							entry.setValue(e.getMessage());
						} catch (Exception e) {
							entry.setValue(e.getMessage());
						}
					}
				}
			}
		}
		
		return record;
	}
	
	public List<HashMap<String, Object>> decrypt(List<HashMap<String, Object>> records) {
		for (int intA=0; intA<records.size(); intA++) {
			this.decrypt(records.get(intA));
		}
		
		return records;
	}
}
