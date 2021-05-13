package kr.co.itfact.scrm.json.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.itfact.scrm.common.DefaultConstants;
import kr.co.itfact.scrm.dao.DefaultDAO;
import kr.co.itfact.scrm.json.common.ResponseServiceImpl;

@RestController
@EnableWebMvc
public class ElasticSearchController {	
	private final Logger logger = LoggerFactory.getLogger(CallBotController.class);
	
	@Autowired
	@Qualifier("primaryDAO")
	private DefaultDAO daoPrimary;
		
	@Autowired
	private ResponseServiceImpl responseService;
	
	@RequestMapping(value = "/sttSearch.service.do", method = {RequestMethod.POST})
	public void sttSearch(HttpServletRequest request, HttpServletResponse response, @RequestBody String transdata) throws Exception {		
		request.setAttribute("transdata", transdata);
		
		ObjectMapper mapper = new ObjectMapper();
	
		HashMap<String, Object> transdataMap    = (HashMap<String, Object>)(mapper.readValue(transdata, HashMap.class)).get("transdata");
		HashMap<String, Object> requestDataSet  = (HashMap<String, Object>) transdataMap.get("datasets");
		HashMap<String, Object> responseDataSet = new HashMap<String, Object>();
	
		String data = requestDataSet.get("data").toString();
		
		System.out.println(requestDataSet.get("data"));
		
		ArrayList gifnoc = (ArrayList) transdataMap.get("gifnoc");		
		
		HashMap<String, String> hashGifnoc = (HashMap<String, String>) gifnoc.get(0);
				
		String datasetrecv = hashGifnoc.get("datasetrecv");
		
		try {			
			
            String apiURL = "http://192.168.0.248:9200/stt_data-1/_search?pretty";
            URL url = new URL(apiURL);
                        
            HttpURLConnection con = (HttpURLConnection) url.openConnection();

            con.setRequestMethod("POST");                        
            con.setRequestProperty("Content-Type", "application/json"); 
            con.setDoOutput(true);
           	        
	        OutputStream out_stream = con.getOutputStream();

	        out_stream.write(data.getBytes("UTF-8"));
	        out_stream.flush();
	        out_stream.close();

            int responseCode = con.getResponseCode(); 
            
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(), DefaultConstants.CHARSET_UTF8)); 
            
            String inputLine; 
            StringBuffer responses = new StringBuffer();
                        
            
            while ((inputLine = in.readLine()) != null) { 
            	responses.append(inputLine); 
            	
            } 
            
            in.close(); 
            
            responseDataSet.put(datasetrecv, responses.toString());
            
        } catch (Exception e) {        	
            System.out.println(e);
        }
		
		responseService.response(response, mapper.writeValueAsString(responseDataSet));
		
	}
}
