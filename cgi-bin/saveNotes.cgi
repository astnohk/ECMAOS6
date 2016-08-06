#!/usr/bin/python3
import cgi
import cgitb
import io
import json
import os
import subprocess
import sys
import time

import authentication
import encryption
import replacer

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding = 'utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding = 'utf-8')


cgitb.enable()
print('Content-type: text/plain')
print('')

post = cgi.FieldStorage()

# Authentication
if 'id' not in post.keys() or 'onetimepass' not in post.keys():
	sys.exit()
loginID = encryption.decrypt_RSA(post.getfirst('id'))
one_time_pass = encryption.decrypt_RSA(post.getfirst('onetimepass'))
if not authentication.authID(loginID, one_time_pass):
	sys.exit()

# Get unix epoch
unixtime = int(round(time.time()))

# Load Notes database
Main_Filename = 'Notes.dat'
Connection_Filename = 'Notes-Users.dat'
noteList = list()
if os.path.exists('Data/data/' + Main_Filename):
	fdat = open('Data/data/' + Main_Filename, 'r', encoding = 'utf-8')
	tmp = fdat.read()
	if len(tmp.rstrip(' \n')) > 0:
		noteList = json.loads(tmp)
	fdat.close()
noteConnectionsList = list()
if os.path.exists('Data/data/' + Connection_Filename):
	fdat = open('Data/data/' + Connection_Filename, 'r', encoding = 'utf-8')
	tmp = fdat.read()
	if len(tmp.rstrip(' \n')) > 0:
		noteConnectionsList = json.loads(tmp)
	fdat.close()

# Add sent note
if 'note' not in post.keys() or 'users' not in post.keys():
	print('NO data')
	sys.exit()
note = replacer.four_letter(encryption.decrypt_RSA(post.getfirst('note')))
data = {'id': unixtime, 'note': note}
noteList.append(data)
users = json.loads(encryption.decrypt_RSA(post.getfirst('users')))
for user in users:
	tmp = {'name': user, 'noteId': unixtime}
	noteConnectionsList.append(tmp)

# Sort list
noteList = sorted(noteList, key = lambda x: x['id'])
noteConnectionsList = sorted(noteConnectionsList, key = lambda x: x['noteId'])

# delete note history over maxNoteHistory
maxNoteHistory = 3000
lengthNotes = len(noteList)
if lengthNotes > maxNoteHistory:
	del noteList[0 : (lengthNotes - maxNoteHistory)]
for num in range(0, len(noteConnectionsList)):
	if noteConnectionsList[num]['noteId'] >= noteList[0]['id']:
		break
del noteConnectionsList[0 : num]

# Write to database
## Note
fdat = open('Data/data/' + Main_Filename, 'w', encoding = 'utf-8')
fdat.write(json.dumps(noteList, ensure_ascii = False, sort_keys = True))
fdat.close()
## Connection of Notes-Users
fdat = open('Data/data/' + Connection_Filename, 'w', encoding = 'utf-8')
fdat.write(json.dumps(noteConnectionsList, ensure_ascii = False, sort_keys = True))
fdat.close()

print('length of notes = ' + str(len(noteList)))

