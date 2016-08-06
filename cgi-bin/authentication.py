import os



def authID(id, password):
	dat_dir = os.path.dirname(os.path.dirname(__file__)) + "/config/id_rand/"
	try:
		fdat = open(dat_dir + id, "r", encoding = "utf-8")
	except OSError as e:
		return False
	one_time_pass = fdat.read()
	fdat.close()

	if password == one_time_pass:
		# update time stamp
		fdat = open(dat_dir + id, "w", encoding = "utf-8")
		fdat.write(one_time_pass)
		fdat.close()
		return True
	else:
		return False

