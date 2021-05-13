package kr.co.itfact.scrm.json.dataset;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * <i>Note: The ConfigDataSet class is the dataset control object for the transaction using json</br></i>
* </br>
 * 
 * @author choi woo keun ( wookeun.choi@gmail.com )
 * @version 1.0
 * @since 2014.03.12
 * 
 */
public class ConfigDataSet {
	public static final Logger logger = LoggerFactory.getLogger(ConfigDataSet.class);
	
	public static final String CONFIG_VARIABLE_NAME		= "gifnoc";
	public static final String ROWTYPE_VARIABLE_NAME	= "epytwor";
	
	public static final String COLUMN_DAO_DV			= "dao";
	public static final String COLUMN_TRANS_DV			= "crudh";
	public static final String COLUMN_SQL_ID			= "sqlmapid";
	public static final String COLUMN_DATASET_SEND		= "datasetsend";
	public static final String COLUMN_DATASET_RECV		= "datasetrecv";
	public static final String COLUMN_DATASET_MAPP		= "datasetmap";
	public static final String COLUMN_COLUMN_ID			= "columnid";
	public static final String COLUMN_SYSTEM_ID			= "systemid";
	public static final String COLUMN_TRANS_LOG			= "translog";
	public static final String COLUMN_SYNTAX			= "syntax";
	public static final String COLUMN_RETRY_CNT			= "retry";
	
	public static final String ROWTYPE_DV_READ			= "read";
	public static final String ROWTYPE_DV_CREATE		= "create";
	public static final String ROWTYPE_DV_UPDATE		= "update";
	public static final String ROWTYPE_DV_DESTROY		= "destroy";
	public static final String ROWTYPE_DV_EAI			= "eai";
	public static final String ROWTYPE_DV_SAFENO		= "safeno";
	
	public static final int TRANS_DV_CREATE				= 0;
	public static final int TRANS_DV_READ				= 1;
	public static final int TRANS_DV_UPDATE				= 2;
	public static final int TRANS_DV_DESTROY			= 3;
	public static final int TRANS_DV_PROCEDURE			= 4;
	public static final int TRANS_DV_HANDLE				= 5;
	public static final int TRANS_DV_SEQUENCE			= 6;
	public static final int TRANS_DV_ITERATE			= 7;
	public static final int TRANS_DV_BATCH				= 8;
	public static final int TRANS_DV_DIR				= 9;
	public static final int TRANS_DV_PASSWD				= 10;
	public static final int TRANS_DV_INTERFACE			= 11;
	public static final int TRANS_DV_STT_SEARCH			= 12;
	
	public static final int DAO_PRIMARY					= 0;
	public static final int DAO_SECONDARY				= 1;
	public static final int DAO_CTI						= 2;
	
	public static final String PREFIX_ENCRYPT			= "ENC_";
	public static final String PREFIX_ORIGINAL			= "ORG_";
	public static final String PREFIX_CREATE			= ".C_";
	public static final String PREFIX_READ				= ".R_";
	public static final String PREFIX_UPDATE			= ".U_";
	public static final String PREFIX_DESTROY			= ".D_";
	public static final String PREFIX_HANDLE			= ".H_";
	
	public static String ROWTYPE_CREATE					= "c";
	public static String ROWTYPE_READ					= "r";
	public static String ROWTYPE_UPDATE					= "u" ;
	public static String ROWTYPE_DESTROY				= "d";
	
	public static String SYNTAX_CAMEL					= "c";
	public static String SYNTAX_MAPPER					= "m";
	
	public static final String SQLMAPID_TRANS_LOG_SEQUENCE	= "COM.R_SysIndvInfAprcSpSeq";
	public static final String SQLMAPID_TRANS_LOG_CREATE	= "COM.C_SysIndvInfAprcSp";
	public static final String SQLMAPID_TRANS_LOG_UPDATE	= "COM.U_SysIndvInfAprcSp";
	
	private List<HashMap<String, Object>> configs		= null;
	
	public ConfigDataSet() {}
	
	public ConfigDataSet(List<HashMap<String, Object>> list, HashMap<String, Object> rowtype) {
		this.configs = list;
		
		if (rowtype != null) {
			ConfigDataSet.ROWTYPE_CREATE = (String) (rowtype.get(ConfigDataSet.ROWTYPE_DV_CREATE) == null || rowtype.get(ConfigDataSet.ROWTYPE_DV_CREATE).equals("") ? ConfigDataSet.ROWTYPE_CREATE: rowtype.get(ConfigDataSet.ROWTYPE_DV_CREATE));
			ConfigDataSet.ROWTYPE_READ = (String) (rowtype.get(ConfigDataSet.ROWTYPE_DV_READ) == null || rowtype.get(ConfigDataSet.ROWTYPE_DV_READ).equals("") ? ConfigDataSet.ROWTYPE_READ: rowtype.get(ConfigDataSet.ROWTYPE_DV_READ));
			ConfigDataSet.ROWTYPE_UPDATE = (String) (rowtype.get(ConfigDataSet.ROWTYPE_DV_UPDATE) == null || rowtype.get(ConfigDataSet.ROWTYPE_DV_UPDATE).equals("") ? ConfigDataSet.ROWTYPE_UPDATE: rowtype.get(ConfigDataSet.ROWTYPE_DV_UPDATE));
			ConfigDataSet.ROWTYPE_DESTROY = (String) (rowtype.get(ConfigDataSet.ROWTYPE_DV_DESTROY) == null || rowtype.get(ConfigDataSet.ROWTYPE_DV_DESTROY).equals("") ? ConfigDataSet.ROWTYPE_DESTROY: rowtype.get(ConfigDataSet.ROWTYPE_DV_DESTROY));
		}
	}
	
	public List<HashMap<String, Object>> getConfigs() {
		return this.configs;
	}

	public void setConfigs(List<HashMap<String, Object>> list) {
		this.configs = list;
	}
	
	public String getSqlID(int rowindex) {
		logger.debug("[ transaction ] config   :: " + (this.configs.get(rowindex).toString()));
		return (this.configs.get(rowindex)).get(ConfigDataSet.COLUMN_SQL_ID).toString();
	}
	
	public int getDaoDv(int rowindex) {
		return Integer.parseInt((this.configs.get(rowindex)).get(ConfigDataSet.COLUMN_DAO_DV).toString(), 10);
	}
	
	public int getTransDv(int rowindex) {
		return Integer.parseInt((this.configs.get(rowindex)).get(ConfigDataSet.COLUMN_TRANS_DV).toString(), 10);
	}
	
	public String getDatasetsSend(int rowindex) {
		return (this.configs.get(rowindex)).get(ConfigDataSet.COLUMN_DATASET_SEND).toString();
	}
	
	public String getDatasetsRecv(int rowindex) {
		return (this.configs.get(rowindex)).get(ConfigDataSet.COLUMN_DATASET_RECV).toString();
	}
	
	public String getDatasetsMapp(int rowindex) {
		return (this.configs.get(rowindex)).get(ConfigDataSet.COLUMN_DATASET_MAPP).toString();
	}
	
	public String[] getDatasetsMappList(int rowindex) {
		return this.getStringToArray(this.getDatasetsMapp(rowindex));
	}
	
	public String getColumnID(int rowindex) {
		return (this.configs.get(rowindex)).get(ConfigDataSet.COLUMN_COLUMN_ID).toString();
	}
	
	public String getSystemID(int rowindex) {
		return (this.configs.get(rowindex)).get(ConfigDataSet.COLUMN_SYSTEM_ID).toString();
	}
	
	public int getRetryCount(int rowindex) {
		return Integer.parseInt((this.configs.get(rowindex)).get(ConfigDataSet.COLUMN_RETRY_CNT).toString(), 10);
	}
	
	public String getSyntax(int rowindex) {
		return (this.configs.get(rowindex)).get(ConfigDataSet.COLUMN_SYNTAX).toString();
	}
	
	@SuppressWarnings("unchecked")
	public HashMap<String, Object> getTransLog(int rowindex) {
		return (HashMap<String, Object>)(this.configs.get(rowindex)).get(ConfigDataSet.COLUMN_TRANS_LOG);
	}

	public boolean isIterateColumn(String dsname, String column) {
		boolean isIterate	= false;
		if(this.configs != null) {			
			for (int intA=0; intA < this.configs.size(); intA++) {
				if (this.getTransDv(intA) == ConfigDataSet.TRANS_DV_ITERATE
						&& this.getDatasetsMapp(intA).toUpperCase().equals(dsname.toUpperCase())
						&& this.getColumnID(intA).equals(column.toUpperCase())) {
					isIterate	= true;
					break;
				}
			}
		}
		
		return isIterate;
	}
	
	public int[] getBeforeList() {
		List<Integer> list	= new ArrayList<Integer>();
		if(this.configs != null) {
			for (int intA=0; intA < this.configs.size(); intA++) {
				if (this.getTransDv(intA) == ConfigDataSet.TRANS_DV_SEQUENCE || this.getTransDv(intA) == ConfigDataSet.TRANS_DV_PASSWD) {
					list.add(new Integer(intA));
				}
			}
		}
		
		int[]	intSeqRows	= new int [list.size()];
		for (int intA=0; intA<list.size(); intA++) {
			intSeqRows[intA]	= list.get(intA).intValue();
		}
		
		return intSeqRows;
	}
	
	public int[] getSequenceList() {
		List<Integer> list	= new ArrayList<Integer>();
		if(this.configs != null) {
			for (int intA=0; intA < this.configs.size(); intA++) {
				if (this.getTransDv(intA) == ConfigDataSet.TRANS_DV_SEQUENCE) {
					list.add(new Integer(intA));
				}
			}
		}
		
		int[]	intSeqRows	= new int [list.size()];
		for (int intA=0; intA<list.size(); intA++) {
			intSeqRows[intA]	= list.get(intA).intValue();
		}
		
		return intSeqRows;
	}
	
	public int[] getPasswordList() {
		List<Integer> list	= new ArrayList<Integer>();
		if(this.configs != null) {
			for (int intA=0; intA < this.configs.size(); intA++) {
				if (this.getTransDv(intA) == ConfigDataSet.TRANS_DV_PASSWD) {
					list.add(new Integer(intA));
				}
			}
		}
		
		int[]	intRows	= new int [list.size()];
		for (int intA=0; intA<list.size(); intA++) {
			intRows[intA]	= list.get(intA).intValue();
		}
		
		return intRows;
	}
	
	public int[] getTransactionList() {
		List<Integer> list	= new ArrayList<Integer>();
		if(this.configs != null) {
			for (int intA=0; intA < this.configs.size(); intA++) {
				if (this.getTransDv(intA) == ConfigDataSet.TRANS_DV_CREATE
						|| this.getTransDv(intA) == ConfigDataSet.TRANS_DV_READ
						|| this.getTransDv(intA) == ConfigDataSet.TRANS_DV_UPDATE
						|| this.getTransDv(intA) == ConfigDataSet.TRANS_DV_DESTROY
						|| this.getTransDv(intA) == ConfigDataSet.TRANS_DV_PROCEDURE
						|| this.getTransDv(intA) == ConfigDataSet.TRANS_DV_HANDLE
						|| this.getTransDv(intA) == ConfigDataSet.TRANS_DV_BATCH
						|| this.getTransDv(intA) == ConfigDataSet.TRANS_DV_DIR
						) {
					list.add(new Integer(intA));
				}
			}
		}
		
		int[]	intSeqRows	= new int [list.size()];
		for (int intA=0; intA<list.size(); intA++) {
			intSeqRows[intA]	= list.get(intA).intValue();
		}
		
		return intSeqRows;
	}
	
	public String getObjectToString(Object value){
		if( value == null ) {
			return "";
		} else {
			return value.toString();
		}
	}
	
	public String[] getStringToArray(String value) {
		return value.replace(" ", "").split(",");
	}
}
