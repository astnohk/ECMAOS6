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
	print("NoIdPassword")
	sys.exit()
loginID = encryption.decrypt_RSA(post.getfirst("id"))
one_time_pass = encryption.decrypt_RSA(post.getfirst("onetimepass"))
if not authentication.authID(loginID, one_time_pass):
	print("InvalidIdPassword")
	sys.exit()

# Check old Password
old_password = encryption.decrypt_RSA(post.getfirst('old'))
old_password_sha512 = subprocess.check_output(['/bin/sh', '-c', 'echo -n "' + old_password + '" | openssl sha512 -binary | base64 -w 0']).decode('utf-8')
user = dict()
fdat = open('../config/shadow', 'r')
for row in fdat:
	if len(row.rstrip(' \n')) > 0:
		datum = json.loads(row)
		user[datum['name']] = datum['password']
fdat.close()
if loginID not in user.keys() or user[loginID] != old_password_sha512:
	print('WrongNameOrPassword', end = '')
	sys.exit()

# Change password
new_password = encryption.decrypt_RSA(post.getfirst('new'))
new_password_sha512 = subprocess.check_output(['/bin/sh', '-c', 'echo -n "' + new_password + '" | openssl sha512 -binary | base64 -w 0']).decode('utf-8')
user[loginID] = new_password_sha512

# Write new password to shadow file
StrData = ""
for Id in user.keys():
	data = {'name': Id, 'password': user[Id]}
	tmp = json.dumps(data, ensure_ascii = False, sort_keys = True)
	StrData += tmp + "\n"
fdat = open("../config/shadow", "w", encoding = "utf-8")
fdat.write(StrData)
fdat.close()

# Return
print("Password has been saved")

