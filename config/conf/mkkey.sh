#!/bin/sh
# Make RSA keys for encryption
#
# How to use:
#     The argument is bit length of the new key
#
#     e.g. Make 1024-bit length RSA key
#     ./mkkey.sh 1024
#

echo "$#"
if [ $# -ge 1 ]; then
	echo "Make RSA key of $1 bits"
	openssl genrsa -out rsa_$1_priv.pem $1
	openssl rsa -pubout -in rsa_$1_priv.pem -out rsa_$1_pub.pem
else
	echo "Please enter the length of bits of key"
fi

