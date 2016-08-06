#!/usr/bin/python3
import cgi
import cgitb
import io
import json
import subprocess
import sys

import authentication
import encryption

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding = "utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding = "utf-8")

cgitb.enable()
print("Content-type: text/plain")
print("")
post = cgi.FieldStorage()

# Authentication
if "id" not in post.keys() or "onetimepass" not in post.keys():
	print("Error: NO ID or password")
	sys.exit()
loginID = encryption.decrypt_RSA(post.getfirst("id"))
one_time_pass = encryption.decrypt_RSA(post.getfirst("onetimepass"))
if not authentication.authID(loginID, one_time_pass):
	print("Error: Invalid ID or password")
	sys.exit()

# Load settings
settings = dict()
fdat = open('../config/user_settings', 'r')
for row in fdat:
	datum = json.loads(row)
	settings[datum['name']] = datum
fdat.close()

# Update settings
new_settings = json.loads(encryption.decrypt_RSA(post.getfirst('settings')))
new_settings['name'] = loginID
settings[loginID] = new_settings

# Write updated settings to the file
StrData = ""
for name in settings.keys():
	tmp = json.dumps(settings[name], ensure_ascii = False, sort_keys = True)
	StrData += tmp + "\n"
fdat = open("../config/user_settings", "w", encoding = "utf-8")
fdat.write(StrData)
fdat.close()

# Return
print("settings updated")

