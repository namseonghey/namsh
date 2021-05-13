package kr.co.itfact.scrm.json.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.itfact.scrm.common.DefaultConstants;
import kr.co.itfact.scrm.common.InterfaceConstants;
import kr.co.itfact.scrm.common.exception.SCRMException;
import kr.co.itfact.scrm.dao.DefaultDAO;
import kr.co.itfact.scrm.json.dataset.ConfigDataSet;
import kr.co.itfact.scrm.json.vo.DefaultVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

public abstract class InterfaceHandlerImpl implements InterfaceHandler {
	private final Logger logger = LoggerFactory.getLogger(InterfaceHandlerImpl.class);
	
	@Autowired
	private Environment env;
	
	private DefaultDAO daoHandler;
	private DefaultVO defaultVo;
	private ObjectMapper oMapper;
	private HashMap<String, Object> mapConfig;
	private HashMap<String, Object> mapIfsInfo;
	private String strSendDsName;
	private String strRecvDsName;
	private List<HashMap<String, Object>> lstSendData;
	private List<HashMap<String, Object>> lstRecvData;
	
	protected int intSoTimeOut = 20 * 1000;
	
	public InterfaceHandlerImpl() {
		this.oMapper = new ObjectMapper();
		this.mapIfsInfo = new HashMap<String, Object>();
	}
	public InterfaceHandlerImpl(DefaultDAO dao, ConfigDataSet config, DefaultVO vo, int rowidx) throws Exception {
		this();
		this.daoHandler = dao;
		this.defaultVo = vo;
		this.mapConfig = config.getConfigs().get(rowidx);
		this.strSendDsName = config.getDatasetsSend(rowidx);
		this.strRecvDsName = config.getDatasetsRecv(rowidx);
		this.lstSendData = vo.getReqDataSet(this.strSendDsName);
		
		this.init();
	}
	
	// Return response data
	public abstract void processResult() throws Exception;
	// Service interface
	public abstract void serviceInterface() throws Exception;
	
	// Initialize
	private void init() throws Exception {
		try {
			this.getInterfaceInfo();
			this.serviceInterface();
			this.processResult();
		} catch (SCRMException e) {
			throw e;
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw e;
		}
	}
	
	// Search interface info (encrypt key)
	private void getInterfaceInfo() throws Exception {
		// Get interface target
		String strSysDv = lstSendData.get(0).get("G_SYS_DV").toString();
		switch (strSysDv) {
		case DefaultConstants.SERVER_PROD:
			strSysDv = DefaultConstants.SUBFIX_PROD;
			break;
		case DefaultConstants.SERVER_DEV:
			strSysDv = DefaultConstants.SUBFIX_DEV;
			break;
		default:
			strSysDv = DefaultConstants.SUBFIX_LOCAL;
			break;
		}
		
		this.mapIfsInfo.put(InterfaceConstants.INTERFACE_TGT_SVR_IP, env.getProperty("interface.target.ip." + strSysDv));
		this.mapIfsInfo.put(InterfaceConstants.INTERFACE_TGT_SVR_PORT, Integer.parseInt(env.getProperty("interface.target.port." + strSysDv)));
		this.mapIfsInfo.put(InterfaceConstants.INTERFACE_URL_QUERY, env.getProperty("interface.target.urlquery." + mapConfig.get(ConfigDataSet.COLUMN_SQL_ID) + "." + strSysDv));
	}
	
	protected String getIfsInfo(String strTgtCol) throws Exception {
		try {
			String strRtn = "";
			strRtn = this.mapIfsInfo.get(strTgtCol).toString();
			return strRtn;
		} catch (NullPointerException e) {
			logger.error("Not Found Interface Column [" + strTgtCol + "]");
			throw e;
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw e;
		}
	}
	
	protected String createSendData() throws Exception {
		HashMap<String, Object> mapSend = new HashMap<String, Object>();
		mapSend.put(this.strSendDsName, this.lstSendData);
		return this.parseMapToJson(mapSend);
	}
	
	protected void setRecvData(String strJson) throws Exception {
		HashMap<String, Object> mapResult = this.parseJsonToMap(strJson);
		if (!mapResult.containsKey(this.strRecvDsName)) {
			//Exception
			throw new SCRMException("no recv ds");
		} else {
			if (mapResult.get(this.strRecvDsName).getClass() == HashMap.class) {
				this.lstRecvData = new ArrayList<HashMap<String, Object>>();
				lstRecvData.add((HashMap<String, Object>)mapResult.get(this.strRecvDsName));
			} else {
				this.lstRecvData = (List<HashMap<String, Object>>)mapResult.get(this.strRecvDsName);
			}
		}
	}
	
	// Parse Map to JSON
	private String parseMapToJson(HashMap<String, Object> mapRootData) throws Exception {
		return this.oMapper.writeValueAsString(mapRootData);
	}
	// Parse JSON to Map
	private HashMap<String, Object> parseJsonToMap(String strJson) throws Exception {
		return this.oMapper.readValue(strJson, HashMap.class);
	}
	
	// Set Response Data to Default VO
	@SuppressWarnings("unchecked")
	public void setResponseVo() throws Exception {
		HashMap<String, Object> mapResData = new HashMap<String, Object>();
		this.defaultVo.getResDatasets().put(this.strRecvDsName, this.lstRecvData);
	}
}
