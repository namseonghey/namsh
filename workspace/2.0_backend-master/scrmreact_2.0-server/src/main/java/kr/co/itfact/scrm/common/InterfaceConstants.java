package kr.co.itfact.scrm.common;

public class InterfaceConstants {
	public static final int INTERFACE_CONN_TIMEOUT = 10000;
	public static final int INTERFACE_SO_TIMEOUT = 40000;
	
	public static final String INTERFACE_REQUEST_DATASET = "REQ_DS";
	public static final String INTERFACE_RESPONSE_DATASET = "RES_DS";
	
	public static final String INTERFACE_IFS_ID = "IFS_ID";
	public static final String INTERFACE_CRUDH = "CRUDH";
	public static final String INTERFACE_TGT_SVR_IP = "SVR_IP";
	public static final String INTERFACE_TGT_SVR_PORT = "SVR_PORT";
	public static final String INTERFACE_TGT_SVR_CONN_ID = "SVR_CONN_ID";
	public static final String INTERFACE_TGT_SVR_CONN_PWD = "SVR_IP";
	public static final String INTERFACE_URL_QUERY = "URL_QUERY";
	public static final String INTERFACE_TGT_ACTION = "TGT_ACTN";
	public static final String INTERFACE_TGT_METHOD = "TGT_MH";
	public static final String INTERFACE_FIX_YN = "FIX_YN";
	public static final String INTERFACE_DV_CHAR = "DV_CHAR";
	public static final String INTERFACE_ENCRP_KEY = "ENCRP_KEY";
	
	public static final String INTERFACE_DV = "IFS_DV";
	public static final String INTERFACE_DV_LINK = "003";
	public static final String INTERFACE_DV_JSON = "001";
	public static final String INTERFACE_SYS_DV = "TGT_SYS_NM";
	public static final String INTERFACE_SYS_DV_PF = "PF";
	public static final String INTERFACE_SYS_DV_AP = "AP";
	public static final String INTERFACE_SYS_DV_ATM = "ATM";
	
	public static final String INTERFACE_COL_SUB_LO_ID = "SUB_LO_ID";
	public static final String INTERFACE_COL_LO_ID = "LO_ID";
	public static final String INTERFACE_COL_TRAN_DV = "TRAN_DV";
	public static final String INTERFACE_COL_ID = "COL_ID";
	public static final String INTERFACE_COL_LEN = "COL_LEN";
	public static final String INTERFACE_COL_BAS_VL = "BAS_VL";
	public static final String INTERFACE_COL_TP = "COL_TP";
	public static final String INTERFACE_COL_TP_OBJECT = "OBJ";
	public static final String INTERFACE_COL_TP_STRING = "STR";
	public static final String INTERFACE_COL_TP_ARRAY = "ARR";
	public static final String INTERFACE_COL_ENCRP = "ENCRP_YN";
	
	public static final String INTERFACE_CHAR_SET_UTF8 = "UTF-8";
	public static final String INTERFACE_CHAR_SET_EUCKR = "EUC-KR";
	
	public static final String INTERFACE_DV_HEADER = "H";
	public static final String INTERFACE_DV_REQUEST = "S";
	public static final String INTERFACE_DV_RESPONSE = "R";
	public static final String INTERFACE_DV_SUB_OBJECT = "O";
	public static final String INTERFACE_DV_SUB_ARRAY = "A";
	public static final String INTERFACE_DV_COMMON = "C";
	
	public static final String INTERFACE_EXCEPTION_UNUSE_IF = "IFS001";
	public static final String INTERFACE_EXCEPTION_UNUSE_LK = "IFS002";
	public static final String INTERFACE_EXCEPTION_SYS_DV = "IFS003";
	public static final String INTERFACE_FLAG_ARRAY = "_ARR_";
	public static final String INTERFACE_FLAG_OBJECT = "_OBJ_";
	public static final String INTERFACE_FLAG_CRYPTO = "ATM_SECURE_";
	
	public static final String INTERFACE_COM_SERVICE_ID = "SVC_ID";
	public static final String INTERFACE_COM_FN_ID = "FN_ID";
	public static final String INTERFACE_COM_USER_ID = "USR_ID";
	public static final String INTERFACE_COM_USER_KEY = "USR_KEY";
	
	public static final String JSON_AP_REQ_SCRN_ID = "screenID";
	public static final String JSON_AP_REQ_ACTN_ID = "actionID";
	public static final String JSON_AP_RESPONSE = "response";
	public static final String JSON_AP_RESULT = "result0";
	public static final String JSON_AP_RESPONSE_OBJECT = "requestAttributeObject";
	public static final String JSON_AP_RESPONSE_CODE = "code";
	public static final String JSON_AP_RESPONSE_MESSAGE = "message";
	public static final String JSON_AP_RESPONSE_CODE_SUCCESS = "200";
	public static final String JSON_AP_RESPONSE_CODE_FAIL = "500";
	public static final String JSON_PF_RESPONSE = "system-header";
	public static final String JSON_PF_RESPONSE_CODE = "ProcFowdName";
	public static final String JSON_PF_RESPONSE_MESSAGE = "answBasc";
	public static final String JSON_PF_RESPONSE_CODE_FAIL = "fail";
	
	public static final String JSON_USER_INFO_LO_ID = "atmUserInfo";
	
	public static final String LINK_RESPONSE_IFS_INFO = "ifsInfo";
	public static final String LINK_RESPONSE_IFS_PARAM = "ifsParam";
	
	public static final String BATCH_USR_CD = "9300002";
	public static final String BATCH_RETURN_MAP = "BAT_RTN_MAP";
	public static final String BATCH_STA_CD_RUNNING = "001";
	public static final String BATCH_STA_CD_COMPLETE = "002";
	public static final String BATCH_STA_CD_FAIL = "003";
}
