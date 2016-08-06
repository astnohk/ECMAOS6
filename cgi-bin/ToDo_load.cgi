#!/usr/bin/python3
import cgi
import cgitb
import io
import json
import os
import sys
import time
from datetime import datetime
import locale

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
	print("No ID or one-time password")
	sys.exit()
loginID = encryption.decrypt_RSA(post.getfirst('id'))
one_time_pass = encryption.decrypt_RSA(post.getfirst('onetimepass'))
if not authentication.authID(loginID, one_time_pass):
	print("Invalid ID or one-time password" + '~')
	sys.exit()

Data_dir = './Data/data/'
# Load user list
users = dict()
fdat = open('../stash/users', 'r', encoding = 'utf-8')
for row in fdat:
	if len(row.rstrip(' \n')) <= 0:
		continue;
	tmp = json.loads(row)
	users[tmp['name']] = tmp
fdat.close()


# ---------- Load Tasks ----------
# Load To-Do task list
filename = 'To-Do.dat'
if not os.path.exists(Data_dir + filename):
	# Make file
	fdat = open(Data_dir + filename, 'w', encoding = 'utf-8')
	fdat.close()
fdat = open(Data_dir + filename, 'r', encoding = 'utf-8')
## Load To-Do tasks
listAllToDoTasks = list()
tmp = fdat.read().rstrip(' \n')
if len(tmp) > 0:
	listAllToDoTasks = json.loads(tmp)
fdat.close()
## Filter the tasks by username and user groups
listToDoTasks = list()
listToDoTags = list()
for task in listAllToDoTasks:
	if task['group'] == loginID or task['group'] in users[loginID]['groups']:
		listToDoTasks.append(task)
		# Make tag list
		for tag in task['tags']:
			if tag not in listToDoTags:
				listToDoTags.append(tag)
# Make Group list
listToDoGroups = list()
listToDoGroups.append(loginID)
listToDoGroups.extend(users[loginID]['groups'])
fdat.close()


# ---------- Output ----------
# merge To-Do Tasks, Tags and Groups
ToDoData = {'tasks': listToDoTasks, 'groups': listToDoGroups, 'tags': listToDoTags}
StrData = json.dumps(ToDoData, ensure_ascii = False, sort_keys = True)


# get public key
if 'pubkey' not in post.keys():
	print("NO public key")
	sys.exit()
tmp = post.getfirst('pubkey').split('\n')
public_key = tmp[0] + '\n'
for i in range(1, len(tmp) - 1):
	public_key += tmp[i].replace(' ', '+') + '\n'
public_key += tmp[len(tmp) - 1] + '\n'


# Encrypt and Send data
encrypted = encryption.encrypt_RSA(public_key, StrData)
# Output
print(encrypted, end = '')

