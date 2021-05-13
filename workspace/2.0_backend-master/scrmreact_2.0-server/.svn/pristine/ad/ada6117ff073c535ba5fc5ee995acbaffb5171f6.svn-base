package kr.co.itfact.scrm.json.controller;

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

import kr.co.itfact.scrm.common.DefaultConstants;
import kr.co.itfact.scrm.dao.DefaultDAO;
import kr.co.itfact.scrm.json.common.ResponseServiceImpl;
import kr.co.itfact.scrm.json.dataset.ConfigDataSet;
import kr.co.itfact.scrm.json.service.DefaultService;

@RestController
@EnableWebMvc
public class SttJobController {
	private final Logger logger = LoggerFactory.getLogger(SttJobController.class);
	
	@Autowired
	@Qualifier("primaryDAO")
	private DefaultDAO daoPrimary;

	
	@RequestMapping(value = "/recvSttData.service.do", method = {RequestMethod.POST})
	public void recvResource(HttpServletRequest request, HttpServletResponse response, @RequestParam("recvData") String recvData) throws Exception {
		logger.debug("STT RECVDATASET DATA recvdata :: " + recvData);
		
		String jsonstring = recvData;
		logger.debug("STT RECVDATASET DATA :: " + jsonstring);
		
		ObjectMapper mapper = new ObjectMapper();
		try {
			HashMap<String, Object> recvSttData = (HashMap<String, Object>)(mapper.readValue(jsonstring, HashMap.class)).get("recvData");
			this.recvSttData(recvSttData);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("[ERROR] SttJobController handler Exception ");
		}
		
		
	}
	public void recvSttData (HashMap<String, Object> recvSttData) {
		ObjectMapper mapper = new ObjectMapper();
		String queryId = recvSttData.get("queryId").toString();
		List<HashMap<String, Object>> list = (List<HashMap<String, Object>>) recvSttData.get("sttData");
		HashMap<String, Object> rowParaemter = null;
		int crudh = -1;
		
		if (queryId.contains(ConfigDataSet.PREFIX_CREATE)) {
			crudh = 0;
		} else if (queryId.contains(ConfigDataSet.PREFIX_UPDATE)) {
			crudh = 2;
		} else if (queryId.contains(ConfigDataSet.PREFIX_DESTROY)) {
			crudh = 3;
		}
		
		for (int intA=0; intA < list.size(); intA++) {
			rowParaemter = list.get(intA);
			rowParaemter.put("G_SYS_DV", DefaultConstants.SERVER_DEV);
			for( Entry<String, Object> elem : rowParaemter.entrySet() ){
				logger.debug("STT Parameter DATA :: " + elem);
				if (!(elem.getValue() instanceof String)) {
					try {
						logger.debug("STT Parameter Convert DATA before :: " + elem.getKey());
						String data = mapper.writeValueAsString(elem.getValue());
						logger.debug("STT Parameter Convert DATA after :: " + data);
						rowParaemter.put(elem.getKey(), data);
					} catch (JsonProcessingException e) {
						e.printStackTrace();
					}
				}
			}
			switch (crudh) {
				case ConfigDataSet.TRANS_DV_CREATE:
					this.daoPrimary.serviceCreate(queryId, rowParaemter);
					break;
				case ConfigDataSet.TRANS_DV_UPDATE:
					this.daoPrimary.serviceUpdate(queryId, rowParaemter);
					break;
				case ConfigDataSet.TRANS_DV_DESTROY:
					this.daoPrimary.serviceDestroy(queryId, rowParaemter);
					break;
			}
		}
	}
}
