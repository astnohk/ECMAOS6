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
	sys.exit()
loginID = encryption.decrypt_RSA(post.getfirst('id'))
one_time_pass = encryption.decrypt_RSA(post.getfirst('onetimepass'))
if not authentication.authID(loginID, one_time_pass):
	sys.exit()


Data_dir = './Data/data/'
# Load stored data
## make file if it is NOT exist
filename = 'To-Do.dat'
if not os.path.exists(Data_dir + filename):
	# make file
	fdat = open(Data_dir + filename, 'w', encoding = 'utf-8')
	fdat.close()
## Load
fdat = open(Data_dir + filename, 'r', encoding = 'utf-8')
ToDoData = dict()
tmp = fdat.read().rstrip(' \n')
if len(tmp) > 0:
	datalist = json.loads(tmp)
	for data in datalist:
		ToDoData[data['id']] = data
fdat.close()


# Update list
sent = post.getlist('data')
for data in sent:
	sent_data = json.loads(encryption.decrypt_RSA(data))
	if sent_data['id'] in ToDoData.keys() and sent_data['timestamp'] > ToDoData[sent_data['id']]['timestamp']:
		sent_data['tags'] = list(map(lambda s: s.lower(), sent_data['tags']))
		ToDoData[sent_data['id']] = sent_data
# Get list of sorted ToDoData
listToDo = sorted(ToDoData.values(), key = lambda x: x['priority'])


# Output Tasks
## Encode JSON data sorted by key in dictionary order
StrData = ''
tmp = json.dumps(listToDo, ensure_ascii = False, sort_keys = True)
StrData = tmp.replace('\n', '\\n')
## Write
fdat = open(Data_dir + filename, 'w', encoding = 'utf-8')
fdat.write(StrData.rstrip('\n'))
fdat.close()


# Message
print('To-Do list saved.', end = '')

