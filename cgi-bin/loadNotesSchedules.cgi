#!/usr/bin/python3
import cgi
import cgitb
import io
import json
import math
import os
import subprocess
import sys

import authentication
import encryption


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

# Parameters
MaxNumOfNotes = 5 # maximum number of notes for each person
#####

# Get public key
if 'pubkey' not in post.keys():
	sys.exit()
tmp = post.getfirst('pubkey').split('\n')
public_key = tmp[0] + '\n'
for i in range(1, len(tmp) - 1):
	public_key += tmp[i].replace(' ', '+') + '\n'
public_key += tmp[len(tmp) - 1] + '\n'

# Load Notes or Schedules
if 'note' in post.keys():
	Main_Filename = 'Notes.dat'
	Connection_Filename = 'Notes-Users.dat'
	names = post.getlist('note')
	ListUserNotes = dict()
	for name in names:
		ListUserNotes[name] = {'name': name, 'notes': list()}
	# Load database
	## Main database
	ListNotes = dict()
	if not os.path.exists('Data/data/' + Main_Filename):
		# make file
		fdat = open('Data/data/' + Main_Filename, 'w', encoding = 'utf-8')
		fdat.close()
	fdat = open('Data/data/' + Main_Filename, 'r', encoding = 'utf-8')
	tmp = fdat.read().rstrip(' \n')
	if len(tmp) > 0:
		notelist = json.loads(tmp)
		for datum in notelist:
			if datum['id'] not in ListNotes.keys():
				ListNotes[datum['id']] = list()
			ListNotes[datum['id']].append(datum['note'])

	fdat.close()
	## Connection database
	if not os.path.exists('Data/data/' + Connection_Filename):
		# make file
		fdat = open('Data/data/' + Connection_Filename, 'w', encoding = 'utf-8')
		fdat.close()
	fdat = open('Data/data/' + Connection_Filename, 'r', encoding = 'utf-8')
	tmp = fdat.read().rstrip(' \n')
	if len(tmp) > 0:
		connectionlist = json.loads(tmp)
		for datum in connectionlist:
			ListUserNotes[datum['name']]['notes'].append(ListNotes[datum['noteId']])
	# Eliminate old notes over than the maximum number
	for name in names:
		LengthNotes = len(ListUserNotes[name]['notes'])
		if LengthNotes > MaxNumOfNotes:
			del ListUserNotes[name]['notes'][0 : LengthNotes - MaxNumOfNotes]
	# Make output strings
	StrData = json.dumps(ListUserNotes, ensure_ascii = False, sort_keys = True)
elif 'schedule' in post.keys():
	if not os.path.exists('Data/data/Schedules.dat'):
		# make file
		fdat = open('Data/data/Schedules.dat', 'w', encoding = 'utf-8')
		fdat.close()
	# Load schedules data
	ListSchedules = list()
	fdat = open('Data/data/Schedules.dat', 'r', encoding = 'utf-8')
	tmp = fdat.read().rstrip(' \n')
	fdat.close()
	if len(tmp) > 0:
		ListSchedules = json.loads(tmp)
	StrData = json.dumps(ListSchedules, ensure_ascii = False, sort_keys = True)
else:
	sys.exit()

# Encryption
encrypted = encryption.encrypt_RSA(public_key, StrData)

# Output
print(encrypted, end = '')

