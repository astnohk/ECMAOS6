#!/usr/bin/python3
import cgi
import cgitb
import io
import json
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding = "utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding = "utf-8")

cgitb.enable()
print("Content-type: application/x-www-form-urlencoded")
print("")

post = cgi.FieldStorage()
key_type = post.getfirst("load")

# Load config
fdat = open("../config/settings", "r", encoding = "utf-8")
config = json.loads(fdat.read())

fdat = open("../config/conf/rsa_" + str(config["RSA_keylength"]) + "_pub.pem", "r")
key = ""
for row in fdat:
	key += row;
fdat.close()
print(key, end = "")

