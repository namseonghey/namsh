package kr.co.itfact.scrm.json.controller;

import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.itfact.scrm.dao.MatchScriptDAO;
import kr.co.itfact.scrm.common.DefaultConstants;
import kr.co.itfact.scrm.dao.DefaultDAO;
import kr.co.itfact.scrm.json.common.ResponseServiceImpl;
import kr.co.itfact.scrm.json.dataset.ConfigDataSet;
import kr.co.itfact.scrm.json.service.DefaultService;
import kr.co.itfact.scrm.json.vo.DefaultVO;

@RestController
@EnableWebMvc
public class CallBotController {
	private final Logger logger = LoggerFactory.getLogger(CallBotController.class);
	
	@Autowired
	@Qualifier("primaryDAO")
	private DefaultDAO daoPrimary;
	
	@Autowired
	private ResponseServiceImpl responseService;
	
	@Autowired
	private MatchScriptDAO mScript;
	
	@RequestMapping(value = "/callbot.service.do", method = {RequestMethod.POST})
	//public void recvResource(HttpServletRequest request, HttpServletResponse response, @RequestParam("TGT_SEQ") int tgt_seq, @RequestParam("text") String text) throws Exception {
	public void recvResource(HttpServletRequest request, HttpServletResponse response,  @RequestBody String transdata )throws Exception {

		request.setAttribute("transdata", transdata);
		
		transdata = URLDecoder.decode( transdata, "UTF-8" );  
		
		ObjectMapper mapper = new ObjectMapper();
		
		HashMap<String, Object> transdataMap    = (HashMap<String, Object>)(mapper.readValue(transdata, HashMap.class)).get("transdata");						
		HashMap<String, Object> requestDataSet  = (HashMap<String, Object>) transdataMap.get("requestDataSet");
		HashMap<String, Object> responseDataSet = new HashMap<String, Object>();

		String PH_NUMBER    = (String) requestDataSet.get("PH_NUMBER");
		String STT          = (String) requestDataSet.get("STT");
		String STEP         = (String) requestDataSet.get("STEP");		
		String PROCESS_CD   = "";
		String SNRO_CD      = "";
		String RTN_TTS_CD   = "TTS0001";		
		String RTN_TTS_TEXT = "";
		String NEXT         = "";
		String parsedDate   = "";
		String TTS_NM       = "";
		String TTS_NB       = "";
		
		int TRY_CNT = 0;
		
		HashMap<String, Object> srchParam       = new HashMap<String, Object>();
		HashMap<String, Object> saveParam       = new HashMap<String, Object>();
		
		String result = "";
		String tgSNRO = "";		
		
		srchParam.put("G_SYS_DV", "L");		
		

		srchParam.put("PH_NUMBER", PH_NUMBER);
		List<HashMap<String, Object>> cusInfo = daoPrimary.serviceRead("SYS.R_getCusProcessInfo", srchParam);
		
		if (cusInfo.size() > 0 && STEP.equals("INIT")) {
			TRY_CNT = Integer.parseInt(cusInfo.get(0).get("TRY_CNT").toString());
			
		}
		
		if (STEP.equals("INIT")) {
			try {				
				List<HashMap<String, Object>> snroInfo = daoPrimary.serviceRead("SYS.R_getSnroProcess", srchParam);
				List<HashMap<String, Object>> TTSInfo  = daoPrimary.serviceRead("SYS.R_getSnroTtsList", srchParam);
				
				System.out.println(snroInfo);
				System.out.println(TTSInfo);
				
				double maxSco  = 0;
				int    target  = -1;								
				
				for (int intA=0; intA < snroInfo.size(); intA++) {
					tgSNRO   = snroInfo.get(intA).get("SNRO_CD").toString();
					int REQ_SCO = Integer.parseInt(snroInfo.get(intA).get("REQ_SCO").toString());				
					int pass;

					pass = mScript.analysisScript(tgSNRO, STT);

					double temp = (double) pass / REQ_SCO;
					
					logger.debug("tgSNRO : " + tgSNRO);
					logger.debug("REQ_SCO : " + REQ_SCO);	
					logger.debug("pass : " + pass);	
					logger.debug("temp : " + temp);			
					logger.debug("maxSco : " + maxSco);		
					
					if (temp >= maxSco && pass >= REQ_SCO) {
						maxSco = temp;
						target = intA;
						SNRO_CD     = tgSNRO;
						RTN_TTS_CD = snroInfo.get(target).get("SUCCESS_TTS").toString();
						PROCESS_CD = snroInfo.get(target).get("PROCESS_CD").toString();
						
					}	
				}
				
				
				if (target >= 0) {
					for (int intA=0; intA < TTSInfo.size(); intA++) {
						String SNRO_TTS_CD = TTSInfo.get(intA).get("SNRO_TTS_CD").toString();
						if (RTN_TTS_CD.equals(SNRO_TTS_CD)) {
							RTN_TTS_TEXT = TTSInfo.get(intA).get("SNRO_TTS_TEXT").toString(); 
							
							if (snroInfo.get(target).get("SUCCESS").toString().equals("NEXT")) {
								NEXT  = Integer.toString((Integer.parseInt(snroInfo.get(target).get("SORT_ORD").toString()) + 1));	
								responseDataSet.put("NEXT", "MID");						
									
							} else if (snroInfo.get(target).get("SUCCESS").toString().equals("INIT")) {
								NEXT  = "INIT";
								responseDataSet.put("NEXT", "INIT");
																
							}
							
							break;
						}
					}									
					TRY_CNT = 0;
					responseDataSet.put("ANS", RTN_TTS_TEXT);
					responseDataSet.put("ERR_CODE", "01");
					responseDataSet.put("ERR_MESSAGE", "");

					saveParam.put("ERR_CODE", "");
					saveParam.put("ERR_MESSAGE", "");
					
				} else {					
					if (cusInfo.size() > 0 && cusInfo.get(0).get("TRY_CNT").toString().equals("3")) {
						RTN_TTS_CD = "TTS0001";
						NEXT = "CS";

						responseDataSet.put("ERR_CODE", "03");
						responseDataSet.put("ERR_MESSAGE", "3회 실패 상담원 연결");
						
						saveParam.put("ERR_CODE", "03");
						saveParam.put("ERR_MESSAGE", "3회 실패 상담원 연결");
						
					} else {
						RTN_TTS_CD = "TTS0000";
						NEXT = "INIT";
						TRY_CNT += 1;

						responseDataSet.put("ERR_CODE", "05");
						responseDataSet.put("ERR_MESSAGE", "NoSnroFound");	

						saveParam.put("ERR_CODE", "05");
						saveParam.put("ERR_MESSAGE", "NoSnroFound");
						
					}	
					
					for (int intA=0; intA < TTSInfo.size(); intA++) {
						String SNRO_TTS_CD = TTSInfo.get(intA).get("SNRO_TTS_CD").toString();
						if (RTN_TTS_CD.equals(SNRO_TTS_CD)) {
							RTN_TTS_TEXT = TTSInfo.get(intA).get("SNRO_TTS_TEXT").toString(); 
								
							break;
						}
					}			
					
					responseDataSet.put("ANS", RTN_TTS_TEXT);
					responseDataSet.put("NEXT", NEXT);


//					List<HashMap<String, Object>> defaultsnroInfo = daoPrimary.serviceRead("COM.R_srchSnroInfoDefualt", srchParam);				
//					responseDataSet.put("ANS", defaultsnroInfo.get(0).get("ANS_CONT").toString());		
					
					result = mapper.writeValueAsString(responseDataSet);				
				}
			  				
			} catch (Exception e) {
				e.printStackTrace();
				logger.error("[ERROR] CallBotController handler Exception ::: snroData error ");
				logger.error(e.getMessage());
				responseDataSet.put("ERR_CODE", "02");
				responseDataSet.put("ERR_MESSAGE", e.getMessage());
				saveParam.put("ERR_CODE", "02");
				saveParam.put("ERR_MESSAGE", e.getMessage());
				
			} finally {
				
				
			}			
			
		} else if (STEP.equals("MID")) {
			try {
				
				
				logger.debug("cusInfo : " + cusInfo.get(0));

				srchParam.put("SNRO_CD", cusInfo.get(0).get("SNRO_CD").toString());
				srchParam.put("SORT_ORD", cusInfo.get(0).get("NEXT").toString());
				
				List<HashMap<String, Object>> snroInfo = daoPrimary.serviceRead("SYS.R_getNextSnroProcess", srchParam);
				
				SNRO_CD = cusInfo.get(0).get("SNRO_CD").toString();					

				parsedDate = cusInfo.get(0).get("STT_DATE").toString();					
				TTS_NM = cusInfo.get(0).get("TTS_NM").toString();	
				TTS_NB = cusInfo.get(0).get("TTS_NB").toString();	
				
				logger.debug("NextsnroInfo : " + snroInfo.get(0));
				
				PROCESS_CD = snroInfo.get(0).get("PROCESS_CD").toString();
				
				HashMap<String, Object> srchParam2 = new HashMap<String, Object>();
				
				srchParam2.put("G_SYS_DV", "L");
				srchParam2.put("SNRO_CD", PROCESS_CD);						
				
				List<HashMap<String, Object>> targetSnro = daoPrimary.serviceRead("SYS.R_getTargetSnro", srchParam2);
				List<HashMap<String, Object>> TTSInfo = daoPrimary.serviceRead("SYS.R_getSnroTtsList", srchParam);						
				
				String type = targetSnro.get(0).get("TYPE_FLAG").toString();
				tgSNRO = targetSnro.get(0).get("SNRO_CD").toString();	
								 
				String TTStartget = "";
				String nextAction = "";				

				logger.debug("targetSnro : " + targetSnro.get(0));
				logger.debug("tgSNRO : " + tgSNRO);
				
				boolean didPass      = false;
				boolean didRecognize = false;
				
				if (type.equals("YN")) {

					int REQ_SCO = Integer.parseInt(targetSnro.get(0).get("REQ_SCO").toString());				
					int pass;

					pass = mScript.analysisScript(tgSNRO, STT);		
					
					if (pass >= REQ_SCO) {
						didPass = true;
						didRecognize = true;					
					} else {
						pass = mScript.analysisScript("SP0003", STT);	
						
						if (pass >= REQ_SCO) {
							didRecognize = true;	
							
						} 
					}
				} else if (type.equals("DATE")) {
					parsedDate = mScript.parsDate(STT);
					
					if (parsedDate.length() > 0) {
						didPass = true;
						didRecognize = true;						
					} 
				} else if (type.equals("SELECT")) {
					int REQ_SCO = Integer.parseInt(targetSnro.get(0).get("REQ_SCO").toString());				
					int pass;

					pass = mScript.analysisScript(tgSNRO, STT);	
					
					if (pass >= REQ_SCO) {
						HashMap<String, Object> srch = new HashMap<String, Object>();
						srch.put("G_SYS_DV", "L");	
						srch.put("SNRO_CD", tgSNRO);	
						List<HashMap<String, Object>> keywordInfo = daoPrimary.serviceRead("SYS.R_getSnroKeywordTarget", srch);	
						
						TTS_NM = keywordInfo.get(pass - 1).get("KEYWORD").toString();
						TTS_NB = keywordInfo.get(pass - 1).get("SELECT_TARGET").toString();
						
						didPass = true;
						didRecognize = true;			
						
					}
				}
				
				if (didPass && didRecognize) {
					TTStartget = snroInfo.get(0).get("SUCCESS_TTS").toString();
					nextAction = snroInfo.get(0).get("SUCCESS").toString();
					
					TRY_CNT = 0;
				} else if (!didRecognize) {
					if (cusInfo.get(0).get("TRY_CNT").toString().equals("3")) {
						TTStartget = "TTS0001";
						nextAction = "CS";
						
					} else {
						TTStartget = "TTS0000";
						nextAction = "RETRY";
						
					}						
					
					TRY_CNT = Integer.parseInt(cusInfo.get(0).get("TRY_CNT").toString()) + 1;
					
				} else {
					TTStartget = snroInfo.get(0).get("FAIL_TTS").toString();
					nextAction = snroInfo.get(0).get("FAIL").toString();					
					
					TRY_CNT = 0;
				}
				

				for (int intB=0; intB < TTSInfo.size(); intB++) {
					String SNRO_TTS_CD = TTSInfo.get(intB).get("SNRO_TTS_CD").toString();
					if (TTStartget.equals(SNRO_TTS_CD)) {
						RTN_TTS_TEXT = TTSInfo.get(intB).get("SNRO_TTS_TEXT").toString(); 
						
						
						String ttsType = TTSInfo.get(intB).get("SNRO_TTS_TP").toString(); 
						
						if (ttsType.equals("DATE")) {
							RTN_TTS_TEXT = RTN_TTS_TEXT.replaceAll("MD", parsedDate);
							
						} else if (ttsType.equals("SELECT")) {							
							RTN_TTS_TEXT = RTN_TTS_TEXT.replaceAll("NM", TTS_NM).replaceAll("NB", TTS_NB);
							
						}
						
						RTN_TTS_CD   = TTSInfo.get(intB).get("SNRO_TTS_CD").toString(); 
						
						break;
					}
				}

				logger.debug("ANS : " + RTN_TTS_TEXT);
				logger.debug("nextAction : " + nextAction);
				logger.debug("snroInfo : " + snroInfo.get(0));
				
				if (nextAction.equals("NEXT")) {
					
					NEXT  = Integer.toString((Integer.parseInt(snroInfo.get(0).get("SORT_ORD").toString()) + 1));							
					
				} else if (nextAction.equals("PREV")) {
					
					NEXT = Integer.toString((Integer.parseInt(snroInfo.get(0).get("SORT_ORD").toString()) - 1));
					
				} else if (nextAction.equals("TARGET")) {
					NEXT = snroInfo.get(0).get("RTN_TARGET").toString();
					
				} else if (nextAction.equals("END")) {
					NEXT = "END";
					
				} else if (nextAction.equals("RETRY")) {
					NEXT = Integer.toString(Integer.parseInt(snroInfo.get(0).get("SORT_ORD").toString()));
					
				} else if (nextAction.equals("CS")) {
					NEXT = "CS";
					
				} else {
					NEXT = "INIT";
					
				}						

				responseDataSet.put("ANS", RTN_TTS_TEXT);
				
				if (nextAction.equals("CS")) {
					responseDataSet.put("ERR_CODE", "03");
					responseDataSet.put("ERR_MESSAGE", "3회 실패 상담원 연결");
					responseDataSet.put("NEXT", "CS");
					
					saveParam.put("ERR_CODE", "03");
					saveParam.put("ERR_MESSAGE", "3회 실패 상담원 연결");
					
				} else {
					responseDataSet.put("ERR_CODE", "01");
					responseDataSet.put("ERR_MESSAGE", "");
					if (NEXT.equals("END")) {
						responseDataSet.put("NEXT", "END");
						
					} else {
						responseDataSet.put("NEXT", "MID");
						
					}
					saveParam.put("ERR_CODE", "");
					saveParam.put("ERR_MESSAGE", "");
					
				}

				
//				List<HashMap<String, Object>> TTSInfo = daoPrimary.serviceRead("SYS.R_getSnroTtsList", srchParam);
				
			} catch (Exception e) {
				e.printStackTrace();
				logger.error("[ERROR] CallBotController handler Exception ::: snroData error ");
				responseDataSet.put("ERR_CODE", "02");
				responseDataSet.put("ERR_MESSAGE", e.getMessage());
				saveParam.put("ERR_CODE", "02");
				saveParam.put("ERR_MESSAGE", e.getMessage());
			} 
		} else {
			
			
		}
		logger.debug("responseDataSet : " + responseDataSet);
		
		if (responseDataSet.size() > 0) {
			result = mapper.writeValueAsString(responseDataSet);
		} else {
			
		}			
		

		saveParam.put("G_SYS_DV", "L");
		saveParam.put("PH_NUMBER", PH_NUMBER);
		saveParam.put("STEP", STEP);
		saveParam.put("STT", STT);
		saveParam.put("SNRO_CD", SNRO_CD);
		saveParam.put("PROCESS_CD", PROCESS_CD);
		saveParam.put("RTN_TTS_CD", RTN_TTS_CD);
		saveParam.put("RTN_TTS_TEXT", RTN_TTS_TEXT);
		saveParam.put("NEXT", NEXT);
		saveParam.put("TRY_CNT", TRY_CNT);
		saveParam.put("STT_DATE", parsedDate);
		saveParam.put("TTS_NM", TTS_NM);
		saveParam.put("TTS_NB", TTS_NB);
		
		daoPrimary.serviceCreate("SYS.C_setCusProcessInfo", saveParam);
		
		transdataMap.put("responseDataSet", result);
		transdataMap.put("requestDataSet", mapper.writeValueAsString(requestDataSet));
		
		responseService.response(response, transdataMap.toString().replaceAll("\\=",":").replaceAll("requestDataSet","\"requestDataSet\"").replaceAll("responseDataSet","\"responseDataSet\""));
	
	}
}
