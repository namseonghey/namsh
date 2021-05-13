#! /bin/sh

if [ "$1" == "" ]
then
        echo ---------------------------------------------------------------------------------------------------------------
        echo __USAGE : MoveFiles.sh -option1
        echo ____option1
        echo ________cust : move the custommer file
        echo ________cont : move the contract file
        echo ---------------------------------------------------------------------------------------------------------------
exit
fi

FTP_PATH=/was6/jeus6/batchfile/${1}
WORK_PATH=/was6/jeus6/batch/work/${1}

echo ""
echo [`date "+%Y%m%d%H%M%S"`] batch MoveFiles.sh start
echo [ FILE LIST ]----------------------------------------------------------------------------------------------------------
ls -al ${FTP_PATH}/*.*
echo [ FILE LIST ]----------------------------------------------------------------------------------------------------------

mv ${FTP_PATH}/*.* ${WORK_PATH}/

echo [`date "+%Y%m%d%H%M%S"`] batch MoveFiles.sh end
echo ""