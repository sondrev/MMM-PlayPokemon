#!/bin/bash

LOCKDIR="pokemonLockdir"
PID_XVFB=""
PID_VBAM=""
PID_LOOP=""
UPDATE_INTERVAL=0.3
IMAGE_TARGET="/home/pi/MagicMirror/modules/MMM-PlayPokemon/image.png"
EMULATOR_LOCATION="/home/pi/MagicMirror/modules/MMM-PlayPokemon/visualboyadvance-m"
ROM_LOCATION="/home/pi/MagicMirror/modules/MMM-PlayPokemon/rom.gb"

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
	    import -display :99 -window root -crop ${W}x${H}+${L}+${T} $IMAGE_TARGET
	    sleep $UPDATE_INTERVAL
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
