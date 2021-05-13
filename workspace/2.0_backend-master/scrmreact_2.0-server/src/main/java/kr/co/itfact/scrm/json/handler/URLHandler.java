package kr.co.itfact.scrm.json.handler;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HostConfiguration;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpConnectionManager;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.ByteArrayRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpConnectionManagerParams;
import org.apache.commons.httpclient.params.HttpMethodParams;
import kr.co.itfact.scrm.common.InterfaceConstants;
import kr.co.itfact.scrm.common.exception.SCRMException;
import kr.co.itfact.scrm.dao.DefaultDAO;
import kr.co.itfact.scrm.json.dataset.ConfigDataSet;
import kr.co.itfact.scrm.json.vo.DefaultVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class URLHandler extends InterfaceHandlerImpl {
	private final Logger logger = LoggerFactory.getLogger(URLHandler.class);
	
	private HttpClient client;
	private HostConfiguration config;
	private PostMethod method;
	private HttpConnectionManager connMng;
	private HttpConnectionManagerParams connParam;
	
	public URLHandler(DefaultDAO dao, ConfigDataSet config, DefaultVO vo, int rowidx) throws Exception {
		super(dao, config, vo, rowidx);
	}
	
	// Communicate
	private void communicate() throws Exception {
		BufferedReader br = null;
		
		try {
			String strJson = this.getRequestStringData();
			
			this.addParameter(strJson);
			this.client.executeMethod(this.config, this.method);
			
			int nState = this.method.getStatusCode();
			
			if (nState == HttpStatus.SC_OK) {
				br = new BufferedReader(new InputStreamReader(this.method.getResponseBodyAsStream(), InterfaceConstants.INTERFACE_CHAR_SET_UTF8));
				this.setRecvData(br.readLine());
			} else {
				throw new Exception(this.method.getStatusText());
			}
		} catch (SCRMException e) {
			logger.error(this.method.getStatusCode() + " [" + this.method.getStatusText() + "]");
			throw e;
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw e;
		} finally {
			this.method.releaseConnection();
			if (br != null) br.close(); 
		}
	}
	
	// Get Request String Data
	private String getRequestStringData() throws Exception {
		return this.createSendData();
	}
	
	// Set Request Entity
	private void addParameter(String strData) throws Exception {
		this.method.setRequestEntity(new ByteArrayRequestEntity(strData.getBytes()));
	}
	
	// Set Parameter NamePairValue
	@SuppressWarnings("unused")
	private void addParameter(HashMap<String, Object> map) {
		for (String key: map.keySet()) {
			this.addParameter(key, map.get(key).toString());
		}
	}
	
	// Set Parameter NamePairValue
	private void addParameter(String strKey, String strVal) {
		this.method.addParameter(strKey, strVal);
	}
	
	// Create Connection
	private void createConnection() throws Exception {
		this.config = new HostConfiguration();
		this.method = new PostMethod();
		
		this.config.setHost(this.getIfsInfo(InterfaceConstants.INTERFACE_TGT_SVR_IP), Integer.parseInt(this.getIfsInfo(InterfaceConstants.INTERFACE_TGT_SVR_PORT)));
		this.method.setPath(this.getIfsInfo(InterfaceConstants.INTERFACE_URL_QUERY));
		this.setTimeOut();
	}
	
	// Set TImeout
	private void setTimeOut() throws Exception {
		// HttpClient
		this.client = new HttpClient();
		
		// Set Parameter ReTry
		this.client.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,  new DefaultHttpMethodRetryHandler(0, false));
		
		// Connection Parameter
		this.connParam = new HttpConnectionManagerParams();
		this.connParam.setConnectionTimeout(InterfaceConstants.INTERFACE_CONN_TIMEOUT);
		this.connParam.setSoTimeout(this.intSoTimeOut);
		
		// Connection Manager
		this.connMng = this.client.getHttpConnectionManager();
		this.connMng.setParams(connParam);
		
		this.client.setHttpConnectionManager(this.connMng);
	}
	
	@Override
	public void processResult() throws Exception {
		this.setResponseVo();
	}
	
	@Override
	public void serviceInterface() throws Exception {
		this.createConnection();
		this.communicate();
	}
}
