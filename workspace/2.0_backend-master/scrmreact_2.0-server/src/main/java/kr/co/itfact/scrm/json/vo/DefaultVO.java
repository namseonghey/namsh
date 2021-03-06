package kr.co.itfact.scrm.json.vo;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.itfact.scrm.common.DefaultConstants;
import kr.co.itfact.scrm.common.exception.SCRMException;
import kr.co.itfact.scrm.json.dataset.ConfigDataSet;

/**
*
* <i>Note: The DefaultVO class is the default Value Object for the transaction using json</br></i>
* </br>
* 
* @author choi woo keun ( wookeun.choi@gmail.com )
* @version 1.0
* @since 2014.03.12
* 
*/
public class DefaultVO {
	private final Logger logger = LoggerFactory.getLogger(DefaultVO.class);

	private String charsetClient	= DefaultConstants.CHARSET_EUCKR;
	private HashMap<String, Object> reqDatasets = null;
	private HashMap<String, Object> resDatasets = null;
	private ConfigDataSet config = null;	
	private HashMap<String, Object> employer = null;
	private String strRemoteHostIp	= null; 
	private String strSystemDv = null;
	
	/**
	 * void <b>initialize</b> (HttpServletRequest request)
	 * 
	 * <pre>
	 * initialize default value object
	 * </pre>
	 * 
	 * @param request
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public void initialize(HttpServletRequest request) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		
		String jsonstring = request.getAttribute("transdata").toString();
		logger.debug("TRANSACTION DATA :: " + jsonstring);
		
		if (jsonstring == null || jsonstring.equals("") || jsonstring.equals("null")) {
			throw new SCRMException("not fined for transdata");
		}
		
		jsonstring = this.stripSpecialCharater(jsonstring);
		HashMap<String, Object> transdata = (HashMap<String, Object>)(mapper.readValue(jsonstring, HashMap.class)).get("transdata");
		
		this.setSystemDv(transdata.get("noisivid").toString());
		
		HashMap<String, Object> mapReyolpme = (HashMap<String, Object>)transdata.get("reyolpme");
		if (mapReyolpme.get("CONN_IP") == null || mapReyolpme.get("CONN_IP").equals(""))
			mapReyolpme.put("CONN_IP", request.getRemoteAddr());
		
		this.setReqDatasets((HashMap<String, Object>)transdata.get("datasets"));
		this.setResDatasets(new HashMap<String, Object>());
		//this.setEmployer((HashMap<String, Object>)transdata.get("reyolpme"));
		this.setEmployer(mapReyolpme);
		this.setReqRemoteHost(request.getRemoteHost());
		
		this.setResConfig();
		
		this.config = new ConfigDataSet((List<HashMap<String, Object>>)transdata.get(ConfigDataSet.CONFIG_VARIABLE_NAME), (HashMap<String, Object>)transdata.get(ConfigDataSet.ROWTYPE_VARIABLE_NAME));
	}
	
	private String stripSpecialCharater(String data) {
		return data == null ? null: data.replaceAll("??????", "%").replaceAll("??????", "=").replaceAll("??????", "&");
	}

	/**
	 * String <b>getCharsetClient</b> ()
	 * 
	 * @return client charactorset
	 */
	public String getCharsetClient() {
		return charsetClient;
	}

	/**
	 * void <b>setCharsetClient</b> (String s)
	 * 
	 * @param charsetClient : client charactorset
	 */
	public void setCharsetClient(String charsetClient) {
		this.charsetClient = charsetClient;
	}
	
	public void setResConfig() {
		this.resDatasets.put("gifnoc", new HashMap<String, Object>());
		this.setResConfig(DefaultConstants.RESULT_CD_SUCCESS, "");
	}
	@SuppressWarnings("unchecked")
	public void setResConfig(String code, String message) {
		((HashMap<String, Object>) this.resDatasets.get("gifnoc")).put("ERR_CODE", code);
		((HashMap<String, Object>) this.resDatasets.get("gifnoc")).put("ERR_MESSAGE", message);
	}
	
	public HashMap<String, Object> getReqDatasets() {
		return this.reqDatasets;
	}

	public void setReqDatasets(HashMap<String, Object> transdata) {
		this.reqDatasets = transdata;
	}

	public HashMap<String, Object> getResDatasets() {
		return this.resDatasets;
	}
	
	public void setEmployer(HashMap<String, Object> employer) {
		this.employer = employer;
	}
	
	public HashMap<String, Object> getEmployer() {
		return this.employer;
	}
	
	public String getEmployer(String info) {
		return this.employer.get(info.replaceFirst("G_", "")) == null ? null: String.valueOf(this.employer.get(info.replaceFirst("G_", "")));
	}
	
	@SuppressWarnings("unchecked")
	public List<HashMap<String, Object>> getResDataset(String dsname) {
		try {
			return (List<HashMap<String, Object>>)this.getResDatasets().get(dsname);
		} catch(Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<HashMap<String, Object>> getResDataset(String dsname, int rowindex) {
		List<HashMap<String, Object>> dataset = null;
		try {
			if (!this.getReqDatasets().containsKey(dsname)) {
				String[] names = getStringToArray(this.config.getDatasetsRecv(rowindex));
				for (int intA=0; intA<names.length; intA++) {
					String[] mapps = names[intA].split("[:]");
					if (mapps.length > 1 && mapps[0].equals(dsname)) {
						dsname = mapps[1];
						break;
					}
				}
			}
			
			dataset = (List<HashMap<String, Object>>)this.getReqDatasets().get(dsname);
		} catch(Exception e) {
			return null;
		}
		
		return dataset;
	}
	
	public void setResDatasets(HashMap<String, Object> transdata) {
		this.resDatasets = transdata;
	}
	
	public void setReqRemoteHost(String ip) {
		this.strRemoteHostIp = ip;
	}
	
	public String getReqRemoteHost() {
		return this.strRemoteHostIp;
	}
	
	@SuppressWarnings("unchecked")
	public List<HashMap<String, Object>> getReqDataSet(String dsname) {
		try {
			return (List<HashMap<String, Object>>)this.getReqDatasets().get(dsname);
		} catch(Exception e) {
			return null;
		}
	}
	
	@SuppressWarnings("unchecked")
	public List<HashMap<String, Object>> getReqDataSet(String dsname, int rowindex) {
		List<HashMap<String, Object>> dataset = null;
		try {
			if (!this.getReqDatasets().containsKey(dsname)) {
				String[] names = getStringToArray(this.config.getDatasetsSend(rowindex));
				for (int intA=0; intA<names.length; intA++) {
					String[] mapps = names[intA].split("[:]");
					if (mapps.length > 1 && mapps[1].equals(dsname)) {
						dsname = mapps[0];
						break;
					}
				}
			}
			
			dataset = (List<HashMap<String, Object>>)this.getReqDatasets().get(dsname);
		} catch(Exception e) {
			return null;
		}
		
		return dataset;
	}
	
	public ConfigDataSet getConfig() {
		return config;
	}

	public void setConfig(ConfigDataSet config) {
		this.config = config;
	}
	
	public String getObjectToString(Object value){
		if( value == null ) {
			return "";
		} else {
			return value.toString();
		}
	}
	
	public String[] getStringToArray(String value) {
		return value.replaceAll(" ", "").split(",");
	}
	
	public HashMap<String, Object> getRowData(int crud,  String dsname, int rowindex){
		List<HashMap<String, Object>> list = this.getReqDataSet(dsname);
		return this.getRowData(crud, list, rowindex);
	}
	
	public HashMap<String, Object> getRowData(int crud, List<HashMap<String, Object>> list, int rowindex){
		HashMap<String, Object> rowdata = new HashMap<String, Object>();
		if(list != null) {
			rowdata = list.get(rowindex);
			String column = null;

			switch (crud) {
			case ConfigDataSet.TRANS_DV_CREATE:
			case ConfigDataSet.TRANS_DV_UPDATE:
			case ConfigDataSet.TRANS_DV_PROCEDURE:
			case ConfigDataSet.TRANS_DV_HANDLE:
			case ConfigDataSet.TRANS_DV_SEQUENCE:
			case ConfigDataSet.TRANS_DV_ITERATE:
			case ConfigDataSet.TRANS_DV_BATCH:
			case ConfigDataSet.TRANS_DV_DIR:
			case ConfigDataSet.TRANS_DV_PASSWD:
				@SuppressWarnings("unchecked")
				HashMap<String, Object> orgdata = (HashMap<String, Object>) rowdata.remove("orgdata");
				if (orgdata != null) {
					HashMap<String, Object> tempmap = new HashMap<String, Object>();
					//String strRowType = ConfigDataSet.ROWTYPE_READ;
					
					//int nRowTypeCnt = 0;
					Iterator<String> orgcolumns = orgdata.keySet().iterator();
					while (orgcolumns.hasNext()) {
						column = orgcolumns.next();
						tempmap.put(ConfigDataSet.PREFIX_ORIGINAL + column, orgdata.get(column));
						
						/*if (rowdata.containsKey("recid") && rowdata.get("recid") != null) {
							if (orgdata.containsKey("recid") && orgdata.get("recid") != null) {
								if (column.equals("recid") || column.equals("rowtype") || column.equals("orgdata")) continue;
								if (!rowdata.get(column).equals(orgdata.get(column))) nRowTypeCnt++;
							} else {
								nRowTypeCnt = -1;
							}
						}*/
					}
					
					//if (nRowTypeCnt > 0) strRowType = ConfigDataSet.ROWTYPE_UPDATE;
					//else if (nRowTypeCnt < 0) strRowType = ConfigDataSet.ROWTYPE_CREATE;
					
					//rowdata.put("rowtype", strRowType);
					rowdata.putAll(tempmap);
					
					//logger.debug("Converted Row Data ::: " + rowdata);
				}
			case ConfigDataSet.TRANS_DV_READ:
			case ConfigDataSet.TRANS_DV_DESTROY:
			default:
			}
			
			// setting the employer data
			if (this.employer != null) {
				rowdata.put("G_USR_CD", this.getEmployer("G_USR_CD"));
				rowdata.put("G_CENT_CD", this.getEmployer("G_CENT_CD"));
				rowdata.put("G_TEAM_CD", this.getEmployer("G_TEAM_CD"));
				rowdata.put("G_AUTH_LV", this.getEmployer("G_AUTH_LV"));
				rowdata.put("G_CONN_IP", this.getEmployer("G_CONN_IP"));
			}
			
			rowdata.put("G_SYS_DV", this.getSystemDv());
		}
		
		logger.debug("[ transaction ] row data :: " + rowdata.toString());
		return rowdata;
	}
	
	public void setSequence(String dsname, String[] columns, String sequence) {
		this.setSequence(this.getReqDataSet(dsname), columns, sequence);
	}
	
	public void setSequence(List<HashMap<String, Object>> list, String[] columns, String sequence) {
		for (int intA=0; intA<list.size(); intA++) {
			HashMap<String, Object> row = (HashMap<String, Object>)list.get(intA);
			for (int intB=0; intB<columns.length; intB++) {
				row.put(columns[intB], sequence);
			}
		}
	}
	
	private void setSystemDv(String strSysDv) {
		this.strSystemDv = strSysDv;
	}
	private String getSystemDv() {
		return this.strSystemDv;
	}
}
