
public class ConvSqlMain {
	public static void main(String[] args) throws Exception {
		String strPreparing		= "SELECT MENU_ID , MENU_NM , MNU_LV , PARN_MENU_ID , SORT_ORD , MENU_ORD , SUB_MENU_ORD , USE_YN , PRG_PATH , MENU_TYPE , STATE , SRCH_YN , POPUP_WD , POPUP_HT FROM ( SELECT A.MENU_ID AS MENU_ID , A.MENU_NM AS MENU_NM , CASE WHEN LENGTH(A.MENU_ID) = 2 THEN 0 WHEN LENGTH(A.MENU_ID) = 4 THEN 1 ELSE 2 END AS MNU_LV , A.PARN_MENU_ID AS PARN_MENU_ID , A.SORT_ORD , CASE WHEN PARN_MENU_ID IS NOT NULL THEN (SELECT TO_CHAR(SORT_ORD) FROM TBL_COM_MENU WHERE MENU_ID = A.PARN_MENU_ID) ELSE TO_CHAR(A.SORT_ORD) END AS MENU_ORD , CASE WHEN PARN_MENU_ID IS NULL THEN '0' ELSE TO_CHAR(A.SORT_ORD) END AS SUB_MENU_ORD , A.USE_YN , A.PRG_PATH , A.MENU_TYPE , CASE WHEN LENGTH(A.MENU_ID) = 2 THEN 0 ELSE NULL END AS STATE , NULL AS SRCH_YN , A.POPUP_WD , A.POPUP_HT FROM TBL_COM_MENU A WHERE 1=1 AND A.USE_YN = 'Y' AND NOT EXISTS ( SELECT 'X' FROM ( SELECT MENU_ID FROM TBL_COM_MENU_IMPS_CENT WHERE CENT_CD= (SELECT CENT_CD FROM TBL_COM_USR WHERE USR_CD = ?) AND MENU_ID NOT IN ( SELECT MENU_ID FROM TBL_COM_USR_ADD_MENU WHERE USR_CD = ? ) UNION SELECT MENU_ID FROM TBL_COM_USR_ADD_MENU WHERE USR_CD = ? AND USE_YN = 'N' UNION SELECT MENU_ID FROM TBL_COM_MENU_LV WHERE USR_AUTH_LV = (SELECT AUTH_LV FROM TBL_COM_USR WHERE USR_CD = ?) AND MENU_ID NOT IN ( SELECT MENU_ID FROM TBL_COM_USR_ADD_MENU WHERE USR_CD = ? ) ) T WHERE T.MENU_ID = A.MENU_ID ) ) ORDER BY MENU_ORD, SUB_MENU_ORD ";
		String strParameters	= "heup(String), heup(String), heup(String), heup(String), heup(String)";
		
		String[] arrParameters = strParameters.split(",");
		for (int index = 0; index < arrParameters.length; index++) {
			if (arrParameters[index].trim().equals("null")) strPreparing = strPreparing.replaceFirst("\\?", "''");
			else strPreparing = strPreparing.replaceFirst("\\?", "'" + (arrParameters[index].substring(0, arrParameters[index].indexOf("("))).trim() + "'");
		}
		
		System.out.println(strPreparing);
	}
}
