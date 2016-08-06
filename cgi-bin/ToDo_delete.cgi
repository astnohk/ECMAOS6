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
filename = 'To-Do.dat'

# Check data
if 'id' not in post.keys() or 'onetimepass' not in post.keys():
	print('No ID or one-time password')
	sys.exit()

# Load config
fdat = open("../stash/config", "r", encoding = "utf-8")
config = json.loads(fdat.read())

# Authentication
loginID = encryption.decrypt_RSA(post.getfirst('id'))
one_time_pass = encryption.decrypt_RSA(post.getfirst('onetimepass'))
if not authentication.authID(loginID, one_time_pass):
	print('Invalid ID or one-time password')
	sys.exit()

Data_dir = './Data/data/'
# Load stored data
## Exit if it is NOT exist
if not os.path.exists(Data_dir + filename):
	print('No To-Do data')
	sys.exit()
## Load
fdat = open(Data_dir + filename, 'r', encoding = 'utf-8')
ToDoData = dict()
tmp = fdat.read().rstrip(' \n')
if len(tmp) > 0:
	datalist = json.loads(tmp)
	for data in datalist:
		ToDoData[data['id']] = data
fdat.close()

# Delete selected To-Do task
deleteId = encryption.decrypt_RSA(post.getfirst('deleteId'))
if deleteId in ToDoData.keys():
	del ToDoData[deleteId]

# Get list of sorted ToDoData
listToDo = sorted(ToDoData.values(), key = lambda x: x['priority'])

# Output
## Encode JSON data sorted by key in dictionary order
tmp = json.dumps(listToDo, ensure_ascii = False, sort_keys = True)
StrData = tmp.replace('\n', '\\n')
## Write
fdat = open(Data_dir + filename, 'w', encoding = 'utf-8')
fdat.write(StrData.rstrip('\n'))
fdat.close()

# Message
print('To-Do task deleted.', end = '')

