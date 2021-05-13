BEGIN
	
				/*
				평가대상번호 채번 procedure
				계약번호, 고객성명, 계약일시를 기준으로 평가대상번호 채번한다
				*/
	
	
				DECLARE V_VLA_TGT_CNT INT DEFAULT 0;
	
				SET V_VLA_TGT_CNT = (SELECT COUNT(*) AS V_CNT_RAW
				  FROM TBL_APP_QA_VLA_RST
				 WHERE CTR_NO = v_CTR_NO)
					;


				 IF V_VLA_TGT_CNT = 0  THEN
				 	IF (v_VLA_BRD_CD = '' || v_VLA_BRD_CD = 'Auto') THEN
						INSERT  INTO TBL_APP_QA_VLA_RST
								 		( CENT_CD
										, TEAM_CD
										, USR_CD
										, CUS_MNGNO
										, CUS_NM
										, CTR_NO
										, CTR_DT
										, VLA_STA_CD
										, VLA_BRD_CD
										, VLA_BRD_VERS
										, AUTO_VLA_YN
										,STT_TRSM_DTM									
								 		)		 	 
								 	VALUES 
								 		(
											 (SELECT CENT_CD FROM STT_TBL_USR WHERE USR_NM = v_RECEIVER)
									 		, (SELECT TEAM_CD FROM STT_TBL_USR WHERE USR_NM = v_RECEIVER)
									 		, (SELECT USR_CD FROM STT_TBL_USR WHERE USR_NM = v_RECEIVER)
									 		, (SELECT CUS_MNGNO FROM TBL_CNS_CUS_NO_NUMNG 
									 						   WHERE TEL_NO = v_CUS_TELL_NUM
									 						     AND CUS_NM = v_CUS_NM
									 						   	 AND CENT_CD = (SELECT CENT_CD FROM STT_TBL_USR WHERE USR_NM = v_RECEIVER )
									 		)
									 		, v_CUS_NM
									 		, v_CTR_NO
									 		, SFTM_GET_CTR_DT(v_CTR_NO, v_CTR_DT, v_CUS_TELL_NUM, v_CUS_NM,  v_RECEIVER)
									 		, '100'
					                  , (
												  SELECT DISTINCT 
												  			SCRT.VLA_BRD_CD 
						                      FROM TBL_APP_QA_VLA_STN_SCRT SCRT				                                 
						                      INNER JOIN TBL_APP_QA_VLA_BRD_INF INF
													   ON (SCRT.VLA_BRD_CD = INF.VLA_BRD_CD)
				                            WHERE DATE_FORMAT(STT_TRSM_DTM, '%Y%m%d') <= v_CTR_DT
						                        AND INF.USE_YN = 'Y'
						                      ORDER BY SCRT.VLA_BRD_VERS DESC LIMIT 1 				                             				                     
						                 )					                  
					                  , (				                     
				                        SELECT DISTINCT 
														 SCRT.VLA_BRD_VERS 
			                             FROM TBL_APP_QA_VLA_STN_SCRT SCRT
				                         INNER JOIN TBL_APP_QA_VLA_BRD_INF INF
												    ON (SCRT.VLA_BRD_CD = INF.VLA_BRD_CD AND SCRT.VLA_BRD_VERS = INF.VLA_BRD_VERS)				                            
					                      WHERE DATE_FORMAT(STT_TRSM_DTM, '%Y%m%d') <= v_CTR_DT
					                        AND INF.USE_YN = 'Y'
					                      ORDER BY SCRT.VLA_BRD_VERS DESC LIMIT 1                                  
					                     )
					                  , 'N'
					             		, (
					             			SELECT DATE_FORMAT(SCRT.STT_TRSM_DTM, '%Y-%m-%d %H:%i:%s')
												FROM   TBL_APP_QA_VLA_STN_SCRT SCRT
												INNER JOIN TBL_APP_QA_VLA_BRD_INF INF
												ON (SCRT.VLA_BRD_CD = INF.VLA_BRD_CD AND SCRT.VLA_BRD_VERS = INF.VLA_BRD_VERS)
												WHERE DATE_FORMAT(SCRT.STT_TRSM_DTM, '%Y%m%d%H%i%s') <= v_CTR_DT
												ORDER BY SCRT.STT_TRSM_DTM DESC
												LIMIT 1
					             			)
										 );
						ELSE 
								INSERT  INTO TBL_APP_QA_VLA_RST
								 		( CENT_CD
										, TEAM_CD
										, USR_CD
										, CUS_MNGNO
										, CUS_NM
										, CTR_NO
										, CTR_DT
										, VLA_STA_CD
										, VLA_BRD_CD
										, VLA_BRD_VERS
										, AUTO_VLA_YN
										,STT_TRSM_DTM									
								 		)		 	 
								 	VALUES 
								 		(
											 (SELECT CENT_CD FROM STT_TBL_USR WHERE USR_NM = v_RECEIVER)
									 		, (SELECT TEAM_CD FROM STT_TBL_USR WHERE USR_NM = v_RECEIVER)
									 		, (SELECT USR_CD FROM STT_TBL_USR WHERE USR_NM = v_RECEIVER)
									 		, (SELECT CUS_MNGNO FROM TBL_CNS_CUS_NO_NUMNG 
									 						   WHERE TEL_NO = v_CUS_TELL_NUM
									 						     AND CUS_NM = v_CUS_NM
									 						   	 AND CENT_CD = (SELECT CENT_CD FROM STT_TBL_USR WHERE USR_NM = v_RECEIVER )
									 		)
									 		, v_CUS_NM
									 		, v_CTR_NO
									 		, SFTM_GET_CTR_DT(v_CTR_NO, v_CTR_DT, v_CUS_TELL_NUM, v_CUS_NM,  v_RECEIVER)
									 		, '100'
					                  , v_VLA_BRD_CD					                  
					                  , (				                     
				                        SELECT DISTINCT 
														 SCRT.VLA_BRD_VERS 
			                             FROM TBL_APP_QA_VLA_STN_SCRT SCRT
				                         INNER JOIN TBL_APP_QA_VLA_BRD_INF INF
												    ON (SCRT.VLA_BRD_CD = INF.VLA_BRD_CD AND SCRT.VLA_BRD_VERS = INF.VLA_BRD_VERS)				                            
					                      WHERE DATE_FORMAT(SCRT.STT_TRSM_DTM, '%Y%m%d%H%i%s') <= v_CTR_DT
													AND SCRT.VLA_BRD_CD = v_VLA_BRD_CD
					                        AND INF.USE_YN = 'Y'
					                      ORDER BY SCRT.VLA_BRD_VERS DESC LIMIT 1                                  
					                     )
					                  , 'N'
					             		, (
					             			SELECT DATE_FORMAT(SCRT.STT_TRSM_DTM, '%Y-%m-%d %H:%i:%s')
												FROM   TBL_APP_QA_VLA_STN_SCRT SCRT
												INNER JOIN TBL_APP_QA_VLA_BRD_INF INF
												ON (SCRT.VLA_BRD_CD = INF.VLA_BRD_CD AND SCRT.VLA_BRD_VERS = INF.VLA_BRD_VERS)
												WHERE DATE_FORMAT(SCRT.STT_TRSM_DTM, '%Y%m%d%H%i%s') <= v_CTR_DT
												AND SCRT.VLA_BRD_CD = v_VLA_BRD_CD
												ORDER BY SCRT.STT_TRSM_DTM DESC
												LIMIT 1
					             			)
										 );
					END IF;
				END IF;
			END