#!/usr/bin/python3
import cgi
import cgitb
import io
import json
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
import authentication
import encryption

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding = 'utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding = 'utf-8')

cgitb.enable()
print('Content-type: application/x-www-form-urlencoded')
print('')

post = cgi.FieldStorage()


# Authentication
if 'id' not in post.keys() or 'onetimepass' not in post.keys():
	print('NoIdPassword', end = '')
	sys.exit()
loginID = encryption.decrypt_RSA(post.getfirst('id'))
one_time_pass = encryption.decrypt_RSA(post.getfirst('onetimepass'))
if not authentication.authID(loginID, one_time_pass):
	print('InvalidIdPassword', end = '')
	sys.exit()


Data_dir = './Data/data/'
# Load stored data
filename = 'To-Do.dat'
## make file if it is NOT exist
if not os.path.exists(Data_dir + filename):
	# make file
	fdat = open(Data_dir + filename, 'w', encoding = 'utf-8')
	fdat.close()
## Load
fdat = open(Data_dir + filename, 'r', encoding = 'utf-8')
listToDoData = list()
tmp = fdat.read().rstrip(' \n')
if len(tmp) > 0:
	listToDoData = json.loads(tmp)
fdat.close()

# Get ID number list and Sorting
idNumberList = list(map(lambda x: int(x['id'][4:]), listToDoData))
idNumberList.sort()

# Search unused ID number
idNumber = 0
for num in idNumberList:
	if idNumber == num:
		idNumber += 1
	else:
		break

# Get list of sorted listToDoData
listToDoData = sorted(listToDoData, key = lambda x: x['priority'])

# Add new task to list
sent = post.getfirst('data')
newTask = json.loads(encryption.decrypt_RSA(sent))
newTask['id'] = 'todo' + str(idNumber)
if len(listToDoData) == 0:
	newTask['priority'] = 0
else:
	newTask['priority'] = listToDoData[len(listToDoData) - 1]['priority'] + 1
newTask['tags'] = list(map(lambda s: s.lower(), newTask['tags']))
listToDoData.append(newTask)

# Output new Tasks
## Encode JSON data sorted by key in dictionary order
tmp = json.dumps(listToDoData, ensure_ascii = False, sort_keys = True)
StrData = tmp.replace('\n', '\\n')
## Write the task
fdat = open(Data_dir + filename, 'w', encoding = 'utf-8')
fdat.write(StrData.rstrip('\n'))
fdat.close()

# get public key
if 'pubkey' not in post.keys():
	print('NO public key')
	sys.exit()
tmp = post.getfirst('pubkey').split('\n')
public_key = tmp[0] + '\n'
for i in range(1, len(tmp) - 1):
	public_key += tmp[i].replace(' ', '+') + '\n'
public_key += tmp[len(tmp) - 1] + '\n'

# Encryption
encrypted = encryption.encrypt_RSA(public_key, json.dumps(newTask, ensure_ascii = False))

# Message
print(encrypted, end = '')

