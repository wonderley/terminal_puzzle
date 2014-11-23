#! /bin/bash
# Hacked based on this: http://www.unix.com/shell-programming-and-scripting/49490-reading-password-echo-character.html

reading=1

export original_setting=$(stty -g)
trap "stty $original_setting; exit" SIGHUP SIGINT SIGTERM
stty -echo -icrnl -icanon min 1 time 0
while ((reading)); do
	keystroke=$(dd bs=1 count=1 2>/dev/null)
	echo -n $keystroke
done
