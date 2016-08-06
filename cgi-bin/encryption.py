import json
import math
import os
import subprocess
import urllib




# Use client generated public key
def encrypt_RSA(public_key, text):
	# Make temporary public key file
	pid = os.getpid()
	tmp_pubkey_name = "Data/tmp_key/tmp_pubkey" + str(pid) + ".pem"
	tmp_pubkey = open(tmp_pubkey_name, "w", encoding = "utf-8")
	tmp_pubkey.write(public_key)
	tmp_pubkey.close()
	# Check bit length of Modulus
	ModulusText = subprocess.check_output(['/bin/sh', '-c', 'openssl rsa -noout -modulus -pubin -in ' + tmp_pubkey_name + ' | tr -d "\n" | wc -c']).decode("utf-8").rstrip(" \n")
	Modulus = int((int(ModulusText) - 8) / 2)
	# Set maximum length of plane text
	max_len = Modulus - 11 # 11bytes are used for padding
	# URIComponent encode
	text_quoted = urllib.parse.quote(text);
	# Encryption
	encrypted = ""
	for i in range(0, math.ceil(len(text_quoted) / max_len)) :
		tmp = text_quoted[max_len * i : min(max_len * (i + 1), len(text_quoted))].replace("\"", "").replace("'", "").replace("\\", "")
		encrypted += subprocess.check_output(['/bin/sh', '-c', 'echo -n "' + tmp + '" | openssl rsautl -encrypt -pubin -inkey ' + tmp_pubkey_name + ' | base64 -w 0']).decode("utf-8").rstrip(" \n") + "|"
	encrypted = encrypted.rstrip("|") # Eliminate extra '|'
	# Remove tmp file
	subprocess.call(['rm', tmp_pubkey_name])

	return encrypted




# Use ../config/conf/rsa_????_priv.pem
def decrypt_RSA(text_base64):
	# Load config
	fdat = open("../config/settings", "r", encoding = "utf-8")
	config = json.loads(fdat.read())

	# Get original base64 encoded message
	encrypted_messages = text_base64.replace(" ", "+").replace("\"", "").replace("'", "").replace("\\", "").split("|")
	# Decryption
	decrypted = ""
	for row in encrypted_messages:
		decrypted += subprocess.check_output(['/bin/sh', '-c', 'echo -n "' + row + '" | base64 -d | openssl rsautl -decrypt -inkey ../config/conf/rsa_' + str(config["RSA_keylength"]) + '_priv.pem']).decode("utf-8")
	# URIComponent decode
	text_unquoted = urllib.parse.unquote(decrypted)

	return text_unquoted

