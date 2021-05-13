package kr.co.itfact.scrm.json.controller;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.itfact.scrm.common.DefaultConstants;
import kr.co.itfact.scrm.json.common.ResponseServiceImpl;
import kr.co.itfact.scrm.json.service.DefaultService;
import kr.co.itfact.scrm.json.vo.DefaultVO;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
@EnableWebMvc
public class DefaultController {
	private final Logger logger = LoggerFactory.getLogger(DefaultController.class);
	
	@Autowired
	private DefaultService svcHandler;

	@Autowired
	private ResponseServiceImpl responseService;
	
	@RequestMapping(value = "/json.service.do", method = {RequestMethod.POST})
	public void service(HttpServletRequest request, HttpServletResponse response, @RequestBody String transdata) throws Exception {
		request.setAttribute("transdata", transdata);
		this.handler(request, response);
	}
	
	
		
	
	@RequestMapping(value = "/upload.service.do", method = {RequestMethod.POST}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public void upload(HttpServletRequest request, HttpServletResponse response, 
			@RequestParam("files") List<MultipartFile> files, @RequestParam("transdata") String transdata) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		DefaultVO voDefault = new DefaultVO();
		
		request.setAttribute("transdata", transdata);
		try {
			voDefault.initialize(request);
			svcHandler.serviceUpload(files);
			
			voDefault.setResConfig(DefaultConstants.RESULT_CD_SUCCESS, "");
		} catch (Exception e) {
			e.printStackTrace();
			//this.doTraceLog(e);
			if (e.getMessage() != null && !e.getMessage().equals("")) {
				voDefault.setResConfig(DefaultConstants.RESULT_CD_UPLOAD_FAIL, e.getMessage());
			} else {
				voDefault.setResConfig(DefaultConstants.RESULT_CD_UPLOAD_FAIL, "업로드 중 오류가 발생했습니다.\n관리자에게 문의하십시오.");
			}
		} finally {
			try {
				responseService.response(response, mapper.writeValueAsString(voDefault.getResDatasets()));
			} catch (Exception e) {
				e.printStackTrace();
				//this.doTraceLog(e);
				logger.error("[ERROR] DefaultController handler Exception ");
			}
		}
	}
	
	public void handler(HttpServletRequest request, HttpServletResponse response) {
		ObjectMapper mapper = new ObjectMapper();
		DefaultVO voDefault = new DefaultVO();		
		
		try {
			voDefault.initialize(request);
			svcHandler.service(voDefault);
		} catch (Exception e) {
			e.printStackTrace();
			//this.doTraceLog(e);
			if (e.getMessage() != null && !e.getMessage().equals("")) {
				voDefault.setResConfig(DefaultConstants.RESULT_CD_ERROR, e.getMessage());
			} else {
				voDefault.setResConfig(DefaultConstants.RESULT_CD_ERROR, "실행 중 오류가 발생했습니다.\n관리자에게 문의하십시오.");
			}
		} finally {
			try {
				responseService.response(response, mapper.writeValueAsString(voDefault.getResDatasets()));
			} catch (Exception e) {
				e.printStackTrace();
				//this.doTraceLog(e);
				logger.error("[ERROR] DefaultController handler Exception ");
			}
		}
	}
	
	private void doTraceLog(Exception e) {
		StackTraceElement[] arrStackTrace = e.getStackTrace();
		for (int idx = 0; idx < arrStackTrace.length; idx++) {
			if (arrStackTrace[idx].getClassName().startsWith("kr.co.itfact.scrm")) {
				String strFileNm = arrStackTrace[idx].getFileName() + ":" + arrStackTrace[idx].getLineNumber();
				logger.error("at " + arrStackTrace[idx].getClassName() + "." + arrStackTrace[idx].getMethodName() + "(" + strFileNm + ")");
			}
		}
	}
}
