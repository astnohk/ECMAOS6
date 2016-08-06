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

# Load user settings
user_settings = dict()
fdat = open('../config/user_settings', 'r')
for row in fdat:
	datum = json.loads(row)
	if datum['name'] == loginID:
		user_settings = datum
		break
fdat.close()
StrData = json.dumps(user_settings, ensure_ascii = False, sort_keys = True)

# get public key
if "pubkey" not in post.keys():
	print("Error: NO public key")
	sys.exit()
tmp = post.getfirst("pubkey").split("\n")
public_key = tmp[0] + "\n"
for i in range(1, len(tmp) - 1):
	public_key += tmp[i].replace(" ", "+") + "\n"
public_key += tmp[len(tmp) - 1] + "\n"

# Encryption
encrypted = encryption.encrypt_RSA(public_key, StrData)

# Return
print(encrypted, end = "")

