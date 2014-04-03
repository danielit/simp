#!/bin/python
#!-*- coding:utf-8 -*-

import os
import time
#from config import *
UPLOAD_FILE_PATH = '/opt/simp/uploadfiles'
UPLOAD_FILE_TYPES = ['txt','xlsx','xls','csv']

def checkFileType(fname,ftypes = UPLOAD_FILE_TYPES):
    tmp = fname.split('.')
    ft = 'xxx'
    if len(tmp)>1 :
        ft = tmp[len(tmp)-1]

    if ft in ftypes:
        return True
    else:
        return False


def uploadFiles(fileMetas,toPath = UPLOAD_FILE_PATH, allowTypes=UPLOAD_FILE_TYPES, logger=None):
    try:
        if fileMetas == None :
            return False

        for fm in fileMetas:
            fname = fm['filename']
            if not checkFileType(fname,allowTypes) :
                if logger:
                    logger.warning('The upload file type is not allowed, file name : %s' % fname)
                continue
            fname = str(time.time()) + '_'+ fname
            fpath = os.path.join(toPath,fname)
            if logger:
                logger.info('Send upload file %s to %s' % (fname,fpath))
            with open(fpath,'wb') as up :
                up.write(fm['body'])
            if logger:
                logger.info('Upload file %s done' % fname)
    except Exception,e:
        if logger:
            logger.error(e)
        return False

    return True


def main():

    fileMetas=[{ \
        'filename' : 'test1.txt',\
        'body':'0x123456789'\
        },{\
            'filename':'test2.xls',\
            'body':'0x9876543210'\
        },{\
            'filename':'test3.pdf',\
            'body':'0x121212121212121212121212'\
    }]

    if uploadFiles(fileMetas):
        print ' file upload done'
    else:
        print 'file upload failed'

if __name__=="__main__":
    main()
