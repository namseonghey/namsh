BEGIN
  /*============================================================================
  -  검색기간 상담원 통계를 뽑는 쿼리 -
  ------------------------------------------------------------------------------
  인자 검색시작일, 검색종료일, 평가표코드, 평가표버전코드
  동적으로 변수 늘어남에 따라서 한가지 평가표 밖에 검색이 안됨
  By. 20.11.06 Chan
  ============================================================================*/
	SET @SQL = NULL; 
	SET @SQL1 = NULL;
	SET @SQL2 = NULL;
	SET @SQL3 = NULL;
	SET @SQL4 = NULL;
	SET @SQL5 = NULL;
	SET @SQL6 = NULL;
	SET @p_Start_YYMMDD = v_Start_YYMMDD;
	SET @p_End_YYMMDD = v_End_YYMMDD;
	SET @p_BRD_CD = v_BRD_CD;
	SET @p_BRD_VERS = v_BRD_VERS;
	SET @convert_YMD = '%Y%m%d';
	SET @convert_Y = '"Y"';
	SET @convert_N = '"N"';
	
	SET @CON1 = ''; 
	SET @CON2 = '';
	SET @CON3 = '';
	
	
	
	
	SELECT
	GROUP_CONCAT(DISTINCT
		CONCAT(
			' CASE WHEN DET.VLA_ITM_CD = ''' , VLA_ITM_CD, ''' THEN DET.TOT_SCO_BY_ITEM  ELSE 0 END AS ', CONCAT('D', ROWNUM), '\r\n',
			', CASE WHEN SCRT.VLA_ITM_CD = ''', VLA_ITM_CD,  ''' THEN SCRT.TOT_SCRT_SCO_BY_ITEM ELSE 0 END AS ', CONCAT('S', ROWNUM), '\r\n'
		)
	),
	GROUP_CONCAT(DISTINCT
		CONCAT(
			' SUM(TMP.' , CONCAT('D', ROWNUM), ') AS ', CONCAT('TOT_VLA_CNT_' , ROWNUM), '\r\n', 
			' , SUM(TMP.' , CONCAT('S', ROWNUM), ') AS ', CONCAT('TOT_SCRT_CNT_' , ROWNUM), '\r\n'
		)
	),
	REPLACE(CONCAT(GROUP_CONCAT(DISTINCT CONCAT(' SUM(TMP.' , CONCAT('D', ROWNUM), ')')), ' AS TOT_VLA_CNT'), ',', '+'),
	REPLACE(CONCAT(GROUP_CONCAT(DISTINCT CONCAT(' SUM(TMP.' , CONCAT('S', ROWNUM), ')')), ' AS TOT_SCRT_CNT'), ',', '+'),
	GROUP_CONCAT(DISTINCT
		CONCAT(
			' CONCAT(ROUND(SUM(' , CONCAT('TOT_VLA_CNT_', ROWNUM), ')/COUNT(VLA.VLA_TGT_NO), 1)',
			', ''(''' ', (ROUND(SUM(', CONCAT('TOT_VLA_CNT_', ROWNUM), ') / SUM(', CONCAT('TOT_SCRT_CNT_', ROWNUM), '), 1) * 100), ''%)'') AS '
			, CONCAT('TOT_S', ROWNUM), '\r\n'
		)
	),
	CONCAT(
		', ROUND((', REPLACE(GROUP_CONCAT(DISTINCT CONCAT('SUM(', CONCAT('TOT_VLA_CNT_', ROWNUM, ')'))), ',', '+') , ') / COUNT(VLA.VLA_TGT_NO), 1) AS TOT_ALL_SCORE_PER'
	) INTO @SQL1, @SQL2, @SQL3, @SQL4, @SQL5, @SQL6
	FROM (
		SELECT
			VLA_ITM_CD
		,	@rownum:=@rownum+1 AS ROWNUM
		FROM(
			SELECT VLA_ITM_CD
			FROM TBL_APP_QA_VLA_STN_SCRT
			WHERE VLA_BRD_CD = @p_BRD_CD
			AND VLA_BRD_VERS = @p_BRD_VERS
			GROUP BY VLA_ITM_CD
			ORDER BY SORT_ORD
		) VLA
		INNER JOIN (SELECT @ROWNUM := 0) TEP
	) ITM
	;
	
	IF v_USR_CD != '' || v_USR_CD != NULL || v_USR_CD != "" THEN 
		SET @CON1 = CONCAT(' AND USR_CD = "', v_USR_CD, '"') ;
	END IF;	
	
	IF v_CENT_CD != '' || v_CENT_CD != NULL || v_CENT_CD != "" THEN 
		SET @CON2 = CONCAT(' AND CENT_CD = "', v_CENT_CD, '"')  ;
	END IF; 
	
	IF v_TEAM_CD != '' || v_TEAM_CD != NULL || v_TEAM_CD != "" THEN 
		SET @CON3 = CONCAT(' AND TEAM_CD = "', v_TEAM_CD, '"')  ;
	END IF; 

	
	SET @SQL = CONCAT(
		'	SELECT \r\n
				VLA.CENT_CD \r\n
		,		SFTM_GET_CENT_NAME(VLA.CENT_CD) AS CENT_NM \r\n
		,		VLA.TEAM_CD \r\n
		,		SFTM_GET_TEAM_NAME(VLA.CENT_CD, VLA.TEAM_CD) AS TEAM_NM \r\n
		,		VLA.USR_CD \r\n
		,		SFTM_GET_USER_NAME(VLA.USR_CD) AS USR_NM \r\n
		,		VLA.VLA_TGT_NO \r\n
		,		COUNT(VLA.VLA_TGT_NO) AS VS_CNT \r\n
		,		SUM(CASE WHEN AUTO_VLA_YN = ''Y'' THEN 1 ELSE 0 END) AS SUM_AUTO_CNT \r\n
		,		SUM(CASE WHEN AUTO_VLA_YN = ''N'' THEN 1 ELSE 0 END) AS SUM_PER_CNT \r\n ,'
		,		@SQL5, 
				@SQL6,
		'	FROM TBL_APP_QA_VLA_RST VLA
			INNER JOIN (
				SELECT
					TMP.VLA_TGT_NO, ',
					@SQL2, ',' ,
					@SQL3, ',' ,  '\r\n',
					@SQL4,  '\r\n',
		'		FROM (
					SELECT
						RST.VLA_TGT_NO
					,	DET.VLA_ITM_CD AS DET_VLA_ITM_CD
					,	DET.TOT_SCO_BY_ITEM
					,	SCRT.VLA_ITM_CD AS SCRT_VLA_ITM_CD
					,	SCRT.TOT_SCRT_SCO_BY_ITEM
					,'
					,	@SQL1,
					'
					FROM TBL_APP_QA_VLA_RST RST
					INNER JOIN (
						SELECT
							VLA_TGT_NO
						,	VLA_BRD_CD
						,	VLA_BRD_VERS
						,	VLA_ITM_CD
						,	SUM(VLA_CONT_CN_1_SCO + VLA_CONT_CN_2_SCO + VLA_CONT_CN_3_SCO) AS TOT_SCO_BY_ITEM
						FROM  TBL_APP_QA_VLA_RST_DET
						GROUP BY VLA_TGT_NO, VLA_BRD_CD, VLA_BRD_VERS, VLA_ITM_CD
					) DET ON (DET.VLA_TGT_NO = RST.VLA_TGT_NO AND DET.VLA_BRD_CD = RST.VLA_BRD_CD AND DET.VLA_BRD_VERS = RST.VLA_BRD_VERS)
					INNER JOIN (
						SELECT
							VLA_BRD_CD
						,	VLA_BRD_VERS
						,	VLA_ITM_CD
						,	STT_TRSM_DTM
						,	SUM(VLA_CONT_CN_1_SCO + VLA_CONT_CN_2_SCO + VLA_CONT_CN_3_SCO) AS TOT_SCRT_SCO_BY_ITEM
						FROM TBL_APP_QA_VLA_STN_SCRT
						WHERE STT_TRSM_DTM IS NOT NULL
						GROUP BY VLA_BRD_CD, VLA_BRD_VERS, STT_TRSM_DTM, VLA_ITM_CD
					) SCRT ON (SCRT.VLA_BRD_CD = DET.VLA_BRD_CD AND SCRT.VLA_BRD_VERS = DET.VLA_BRD_VERS AND SCRT.VLA_ITM_CD = DET.VLA_ITM_CD AND SCRT.STT_TRSM_DTM = RST.STT_TRSM_DTM)',  '\r\n',
					'WHERE RST.VLA_BRD_CD =  @p_BRD_CD', '\r\n',
					'AND RST.VLA_BRD_VERS = @p_BRD_VERS',  '\r\n',
					@CON1,  '\r\n',
					@CON2,  '\r\n',
					@CON3, '\r\n',
					'GROUP BY RST.VLA_TGT_NO, RST.VLA_BRD_CD, RST.VLA_BRD_VERS, DET.VLA_ITM_CD',  '\r\n',
					'ORDER BY RST.VLA_TGT_NO, DET.VLA_ITM_CD',  '\r\n',
				') TMP',  '\r\n',
				'GROUP BY TMP.VLA_TGT_NO',  '\r\n',
			') RST ON RST.VLA_TGT_NO = VLA.VLA_TGT_NO',  '\r\n',
			'WHERE VLA.VLA_BRD_CD =  @p_BRD_CD', '\r\n',
			'AND VLA.VLA_BRD_VERS = @p_BRD_VERS',  '\r\n',
			'AND (DATE_FORMAT(VLA.CTR_DT, @convert_YMD) BETWEEN @p_Start_YYMMDD AND @p_End_YYMMDD)',  '\r\n',
			@CON1,  '\r\n',
			@CON2,  '\r\n',
			@CON3,  '\r\n',
			'GROUP BY VLA.USR_CD',  '\r\n',
			'ORDER BY VLA.CENT_CD, VLA.TEAM_CD, SFTM_GET_USER_NAME(VLA.USR_CD), VLA.USR_CD'
	);
	
	
	INSERT INTO TBL_TMP_TEST (USR_NM, TEMP_TXT) VALUES ('TEST1111', @SQL);
	
	PREPARE stmt FROM @SQL;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;

END