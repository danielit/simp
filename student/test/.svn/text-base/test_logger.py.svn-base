#/usr/bin/env python
import sys
import logging

logger = logging.getLogger("test")
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(name)-12s %(asctime)s %(levelname)-8s %(message)s', '%a, %d %b %Y %H:%M:%S',)
file_handler = logging.FileHandler("test.log")
file_handler.setFormatter(formatter)
file_handler.setLevel(logging.INFO)

stream_handler = logging.StreamHandler(sys.stderr)
stream_handler.setLevel(logging.ERROR)

logger.addHandler(file_handler)  
logger.addHandler(stream_handler)  
#logger.setLevel(logging.ERROR)  
logger.error("error")  
logger.info("info") 
