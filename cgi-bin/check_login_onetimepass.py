#!/usr/bin/python3

import os
import time
import locale

# Set Time out
Time_Out = 10 * 60

file_list = os.listdir("../config/id_rand/")
unix_time = int(time.time())
time_threshold = unix_time - Time_Out

for file_name in file_list:
	if file_name == "dummy": # "dummy" is dummy file for git
		continue
	file_mtime = int(os.stat("../config/id_rand/" + file_name).st_mtime)
	if file_mtime < time_threshold:
		os.remove("../config/id_rand/" + file_name)

