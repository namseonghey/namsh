#! /bin/sh

if [ "${1}" == "" ]
then
                echo ---------------------------------------------------------------------------------------------------------------
                echo __USAGE : RmLog.sh -option1
                echo ____option1
                echo ________debug  : rm the debug log
                echo ________db     : rm the db log
                echo ________daemon : rm the daemon log
                echo ________host   : rm the host log
                echo ---------------------------------------------------------------------------------------------------------------
exit
fi

echo ""
echo [`date "+%Y%m%d%H%M%S"`] batch RmTeletmLog.sh start

LOG_PATH=/logDir/gjsw/teletm/log/${1}
TODAY=`date "+%Y%m%d"`

for _file in ${LOG_PATH}/*.log
do
        if [ "${_file}" != "${LOG_PATH}/${TODAY}.log" ]
        then
                rm -f ${_file}
        fi
done

echo [`date "+%Y%m%d%H%M%S"`] batch RmTeletmLog.sh end
echo ""