#!/bin/bash


LOCKDIR="pokemonLockdir"
PID_XVFB=""
PID_VBAM=""
PID_LOOP=""
fcount=1
MIN_SLEEP=0
REPORT_FPS_EVERY=10
INSTALL_LOCATION="../"
IMAGE_TARGET=$INSTALL_LOCATION"image.png"
LAST_FPS_REPORT=0

VBAM_LOCATION="./visualboyadvance-m"

function handleFps {
	if [ $fcount -eq 1 ]
	then
		startFPS=`date +%s%3N`
	fi
	
	if [ $fcount -eq 11 ]
	then
		endFPS=`date +%s%3N`
		timeS=`date +%s`
		elapsedFPSms=$((endFPS-startFPS))
		elapsedFPSs=$(bc -l <<< '10/('$((elapsedFPSms))'/1000)')
		if [ $(($timeS - $LAST_FPS_REPORT)) -ge $REPORT_FPS_EVERY ] 
		then
			LAST_FPS_REPORT=$timeS
			echo $elapsedFPSs
		fi
		fcount=0
	fi

	fcount=$((fcount+1))
}

function run {
	killall Xvfb	
	export DISPLAY=:99

	W=480
	H=430
	L=0
	T=26
	WT=$((W+L))
	HT=$((H+T))
	
	while true; do
	    	start=`date +%s%3N`
	    	import -display :99 -window root -crop ${W}x${H}+${L}+${T} $IMAGE_TARGET
	    	end=`date +%s%3N`
 		elapsed=$((end-start))
		sleeptime=$(bc -l <<< $((MIN_SLEEP-elapsed))'/1000')
		handleFps
		if (( $(echo "$sleeptime > 0" | bc -l) )); then
			sleep $sleeptime
		fi
	    	
	done &
	PID_LOOP=$!
	Xvfb -ac :99 -screen 0 ${WT}x${HT}x24 &
	PID_XVFB=$!
	./visualboyadvance-m ./rom.gb
	PID_VBAM=$!        

}


#Remove the lock directory
function cleanup {
   kill -15 $PID_LOOP
   kill -15 $PID_XVFB
   kill -15 $PID_VBAM
    if rmdir $LOCKDIR; then
        echo "Finished"
    else
        echo "Failed to remove lock directory '$LOCKDIR'"
        exit 1
    fi
}

if mkdir $LOCKDIR; then
    #Ensure that if we "grabbed a lock", we release it
    #Works for SIGTERM and SIGINT(Ctrl-C)
    trap "cleanup" EXIT
    echo "Acquired lock, running"
    run
    # Processing starts here
else
    echo "Could not create lock directory '$LOCKDIR'"
    exit 1
fi
