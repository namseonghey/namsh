BEGIN


SET @SQL = NULL; 
SET @SQL1 = NULL;
SET @SQL2 = NULL;
SET @p_BRD_CD = v_BRD_CD;
SET @p_BRD_VERS = v_BRD_VERS;


SELECT
  GROUP_CONCAT(DISTINCT
    CONCAT(
      ' CASE WHEN INF.VLA_ITM_CD  = ''',
      VLA_ITM_CD,
      ''' THEN (SELECT VLA_ITM_NM FROM TBL_APP_QA_VLA_ITM_INF ITM WHERE ITM.VLA_ITM_CD = INF.VLA_ITM_CD )
    ELSE 0
    END AS ',
      CONCAT('S', ROW),
   ''

    )
  ) INTO @SQL1
FROM (
SELECT 
  VLA_ITM_CD
  , @rownum:=@rownum+1 AS ROW
  FROM (
        SELECT DISTINCT INF.VLA_ITM_CD
               FROM
                    (
                    SELECT  
                      VLA_BRD_CD
                      ,VLA_BRD_VERS
                      ,SORT_ORD
                      ,VLA_ITM_CD
                    FROM TBL_APP_QA_VLA_STN_SCRT
                    GROUP BY VLA_BRD_CD, VLA_BRD_VERS, VLA_ITM_CD

                    ) SCRT
            INNER JOIN TBL_APP_QA_VLA_BRD_LST_INF INF
            ON (SCRT.VLA_BRD_CD = INF.VLA_BRD_CD AND SCRT.VLA_BRD_VERS = INF.VLA_BRD_VERS AND SCRT.VLA_ITM_CD = INF.VLA_ITM_CD)
            WHERE SCRT.VLA_BRD_CD = @p_BRD_CD AND SCRT.VLA_BRD_VERS = @p_BRD_VERS
            ORDER BY SCRT.SORT_ORD
      ) JJ
INNER JOIN (SELECT @ROWNUM := 0) TEP


) BB
;


SELECT
  GROUP_CONCAT(DISTINCT
    CONCAT(
  ' MAX(IF(VLA_ITM_CD = ''',
      VLA_ITM_CD,
      ''', 
    ', CONCAT('S', ROW), ''
   ', 0)) AS ', CONCAT('TOT_', CONCAT('S', ROW))
   , ', ' ,CONCAT('''', 'TOT_S', ROW, ''''), ' AS  COL_S', ROW, ''

    )
  ) INTO @SQL2
FROM (
SELECT 
  VLA_ITM_CD
  , @rownum:=@rownum+1 AS ROW
  FROM (
        SELECT DISTINCT INF.VLA_ITM_CD
               FROM
                    (
                    SELECT  
                      VLA_BRD_CD
                      ,VLA_BRD_VERS
                      ,SORT_ORD
                      ,VLA_ITM_CD
                    FROM TBL_APP_QA_VLA_STN_SCRT
                    GROUP BY VLA_BRD_CD, VLA_BRD_VERS, VLA_ITM_CD

                    ) SCRT
            INNER JOIN TBL_APP_QA_VLA_BRD_LST_INF INF
            ON (SCRT.VLA_BRD_CD = INF.VLA_BRD_CD AND SCRT.VLA_BRD_VERS = INF.VLA_BRD_VERS AND SCRT.VLA_ITM_CD = INF.VLA_ITM_CD)
            WHERE SCRT.VLA_BRD_CD = @p_BRD_CD AND SCRT.VLA_BRD_VERS = @p_BRD_VERS      
				ORDER BY SCRT.SORT_ORD      
      ) JJ
INNER JOIN (SELECT @ROWNUM := 0) TEP


) BB

;

SET @SQL = CONCAT(' 
		
		SELECT 
		  VLA_NM
		    , ',
		    @SQL2,
		    '
		    FROM
		    (
			     SELECT 
				      VLA_BRD_CD
				      , (SELECT DISTINCT VLA_BRD_NM FROM TBL_APP_QA_VLA_BRD_INF WHERE VLA_BRD_CD = INF.VLA_BRD_CD ) AS VLA_NM
				      , VLA_BRD_VERS
				      , VLA_ITM_CD
		            , ',
		            @SQL1,
		            '                
		           FROM
		      	  (
			        SELECT  
			          DISTINCT
			          SCRT.VLA_BRD_CD
			          , SCRT.VLA_BRD_VERS
			          , INF.VLA_ITM_CD
			          FROM
				          (
				          SELECT 
				            DISTINCT
				            VLA_BRD_CD
				            , VLA_BRD_VERS
				            FROM TBL_APP_QA_VLA_STN_SCRT
				            ORDER BY STT_TRSM_DTM DESC
				          ) SCRT
			          INNER JOIN TBL_APP_QA_VLA_BRD_LST_INF INF
			          ON (SCRT.VLA_BRD_CD = INF.VLA_BRD_CD AND SCRT.VLA_BRD_VERS = INF.VLA_BRD_VERS)
			          WHERE SCRT.VLA_BRD_CD = @p_BRD_CD
			          	AND SCRT.VLA_BRD_VERS = @p_BRD_VERS
			        )
		        INF
		        )
		        AAA
		     ');
		     
 		   
    PREPARE stmt FROM @SQL;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
END