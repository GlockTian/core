DOPPLER_PROJECT=arangodb-s3-backup \
DOPPLER_CONFIG=prd \
doppler run --name-transformer tf-var -- terraform $@ 