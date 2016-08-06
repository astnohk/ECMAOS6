#!/usr/bin/python3
import base64
import cgi
import cgitb
import io
import json
import math
import os
import re
import subprocess
import sys

import encryption

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding = 'utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding = 'utf-8')

cgitb.enable()
print('Content-type: application/x-www-form-urlencoded')
print('')

post = cgi.FieldStorage()
keys = post.keys()
pid = os.getpid()


# check name and password has sent
if 'n' in keys and 'p' in keys:
	name_encrypted = post.getfirst('n')
	password_encrypted = post.getfirst('p')
	name = encryption.decrypt_RSA(name_encrypted).rstrip(' \n')
	password = encryption.decrypt_RSA(password_encrypted).rstrip(' \n')
	password_sha512 = subprocess.check_output(['/bin/sh', '-c', 'echo -n "' + password + '" | openssl sha512 -binary | base64 -w 0']).decode('utf-8')
else:
	print('NoNameOrPassword', end = '')
	sys.exit()

# check name and password
user = dict()
fdat = open('../config/shadow', 'r')
for row in fdat:
	if len(row.rstrip(' \n')) > 0:
		datum = json.loads(row)
		user[datum['name']] = datum['password']
fdat.close()
if name not in user.keys() or user[name] != password_sha512:
	print('WrongNameOrPassword', end = '')
	sys.exit()
# login process completed

# set return data in JSON form
return_data = dict()
# generate random one-time password for id
len_rand = 256
random_pass = base64.b64encode(os.urandom(len_rand)).decode('utf-8') # make len_rand-bytes random strings from /dev/urandom
return_data['onetimepass'] = random_pass
fdat = open('../config/id_rand/' + name, 'w', encoding = 'utf-8')
fdat.write(random_pass)
fdat.close()

# encryption
## get public key
if 'key' not in keys:
	sys.exit()
tmp = post.getfirst('key').split('\n')
public_key = tmp[0] + '\n' # Skip and Add header
for i in range(1, len(tmp) - 1):
	public_key += tmp[i].replace(' ', '+') + '\n' # Recovery wrongly converted '+' to ' '
public_key += tmp[len(tmp) - 1] + '\n' # Add footer
## encrypt the return data
StrData= encryption.encrypt_RSA(public_key, json.dumps(return_data))

# output
print(StrData, end = '')

