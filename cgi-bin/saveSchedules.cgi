#!/usr/bin/python3
import cgi
import cgitb
import io
import json
import subprocess
import sys

import authentication
import encryption
import replacer

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding = "utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding = "utf-8")


cgitb.enable()
print("Content-type: text/plain")
print("")

post = cgi.FieldStorage()

# Authentication
if "id" not in post.keys() or "onetimepass" not in post.keys():
	print("Error: NO ID or one-time password")
	sys.exit()
loginID = encryption.decrypt_RSA(post.getfirst("id"))
one_time_pass = encryption.decrypt_RSA(post.getfirst("onetimepass"))
if not authentication.authID(loginID, one_time_pass):
	print("Error: Invalid ID or one-time password")
	sys.exit()

# Load schedules list
scheduleList = list()
fdat = open("Data/data/Schedules.dat", "r", encoding = "utf-8")
tmp = fdat.read().rstrip(" \n")
if len(tmp) > 0:
	scheduleList = json.loads(tmp)
fdat.close()

# Add sent schedule
if "data" not in post.keys():
	print("Error: NO data")
	sys.exit()
data = json.loads(encryption.decrypt_RSA(post.getfirst("data")))
data['text'] = replacer.four_letter(data['text'])
## insert user ID
data['name'] = loginID
scheduleList.append(data)
scheduleList = sorted(scheduleList, key = lambda x: x['starttime'])

# delete old schedule over maxNoteHistory
maxScheduleHistory = 3000
lengthSchedules = len(scheduleList)
if lengthSchedules > maxScheduleHistory:
	del scheduleList[0:(lengthSchedules - maxScheduleHistory)]

# Write schedules
fdat = open("Data/data/Schedules.dat", "w", encoding = "utf-8")
fdat.write(json.dumps(scheduleList, ensure_ascii = False, sort_keys = True))
fdat.close()

print("length of schedules = " + str(len(scheduleList)))

