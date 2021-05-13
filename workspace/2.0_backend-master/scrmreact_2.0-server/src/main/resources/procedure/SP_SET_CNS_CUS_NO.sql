BEGIN
				DECLARE V_USER_CNT INT DEFAULT 0;


				/*
				고객 번호, 전화번호를 기준으로 고객관리번호 채번 procedure
				센터코드가 다른경우에는 새로 채번한다
				*/

				SELECT COUNT(*) INTO V_USER_CNT
				  FROM TBL_CNS_CUS_NO_NUMNG
				 WHERE CUS_NM = v_CUS_NM
				   AND TEL_NO =  v_CUS_TELL_NUM;

				 IF V_USER_CNT = 0 THEN
					 	INSERT INTO TBL_CNS_CUS_NO_NUMNG 
					 				(CENT_CD
				 					, CUS_NM
				 					,TEL_NO)
					 	  	 VALUES (
									 (SELECT CENT_CD FROM STT_TBL_USR WHERE USR_NM = v_RECEIVER)
					 	  			 ,v_CUS_NM
					 	  		     ,v_CUS_TELL_NUM					 	  		  
					 	  		    );

					
				END IF;


			END