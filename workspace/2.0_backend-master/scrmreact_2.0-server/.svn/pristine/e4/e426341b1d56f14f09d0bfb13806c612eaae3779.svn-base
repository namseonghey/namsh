package kr.co.itfact.scrm.batch;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class BatchConstants {
	@Autowired
	private Environment env;
	
	public static final String RESULT_FAIL = "0";
	public static final String RESULT_SUCCESS = "1";
	
	public static final String YYYYMMDD = "YYYYMMDD";
	
	public static final String ALIAS_HINHAN_CARD = "shcd";
	
	public static final String MAPPER_CREATE_BATCH_RESULT = "BAT.C_batchResult";
	
	@PostConstruct
	public void init() {
	}
}
