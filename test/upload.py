# -*- coding:utf-8 -*-

#post form and file to server

import os
import requests
from BeautifulSoup import BeautifulSoup


'''
headers={
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding':'gzip,deflate,sdch',
        'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
        'Cache-Control':'max-age=0',
        'Connection':'keep-alive',
        'Host':'192.168.120.241:2014',
        'Origin':'http://192.168.120.241:2014',
        'Referer':'http://192.168.120.241:2014/',
        'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.146 Safari/537.36'
}
'''

url = 'http://192.168.120.241:2014/index.aspx'
def login(url,user,pwd):

    s = requests.Session()
    s.headers.update({'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.146 Safari/537.36'})
    r = s.get(url)
    soup = BeautifulSoup(r.text)
    vs = soup.find('input',{'name':'__VIEWSTATE'})['value']
    ev = soup.find('input',{'name':'__EVENTVALIDATION'})['value']
#
    data={
        '__VIEWSTATE':vs,
        'TextBox1':'2013111004',
        'TextBox2':'lightning123',
        'ImageButton1.x':'42',
        'ImageButton1.y':'17',
        '__EVENTVALIDATION':ev
    }

    r = s.post(url,data=data)
    if r.status_code == 200 or r.status_code == 302:
        return (r,s)
    else:
        return None
#proxy={'http':'http://192.168.85.100:8008/'}
#r = requests.post(url,data=data,headers=headers,proxies=proxy)
#s.headers.update({'Referer':'http://192.168.120.241:2014/geren.aspx?userid=394'})
#s.headers.update({'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.146 Safari/537.36'})
#url2='http://192.168.120.241:2014/deletefile.ashx?wenjianid=7823'
#r = s.get(url2)


#r = requests.get(url,headers=headers)
'''
print r.text
print r.headers
print r.status_code
print r.cookies
print r.url
'''
#print r.text
def _uploadFile(session,html,fPath,url2upload,referer=None):
    soup = BeautifulSoup(html)
    vs = soup.find('input',{'name':'__VIEWSTATE'})['value']
    ev = soup.find('input',{'name':'__EVENTVALIDATION'})['value']
    #print viewstate
    #print eventvalidation
    files={
            'FileUpload1':(os.path.basename(fPath),open(fPath,'rb'))
    }
    data={
            '__VIEWSTATE':vs,
            'TextBox1':'abc.doc',
            'Button1':'提交',
            '__EVENTVALIDATION':ev
    }

    #s.headers.update({'Referer':'http://192.168.120.241:2014/geren.aspx?userid=394'})
    #s.headers.update({'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.146 Safari/537.36'})
    #url = url2upload
    if referer == None:
        referer = url2upload
    session.headers.update({'Referer':referer})
    print url2upload,data
    r = session.post(url2upload,files=files,data=data)
    if r.status_code == 200 or r.status_code==302:
        print 'upload done'
    else:
        #print r.text
        print r.status_code

#param html is the text of response of http://192.168.120.241:2014/getren.aspx?userid=[]
def getFileList(html):
    con = html
    con = con.split('</blockquote>')
    print len(con)==3
    soup = BeautifulSoup(con[2])
    rets = soup.findAll('div',{'class':'tile bg-color-blueDark outline-color-white'})
    flist=[]
    for ret in rets:
        ff = []
        s = BeautifulSoup(str(ret))
        h5 = s.findAll('h5')
        if len(h5)==2:
            ff.append(h5[0].getText())
            ff.append(h5[1].getText())
        p = s.find('p')
        ff.append(p.getText())
        links = s.findAll('a')
        for link in links:
            ff.append(link.get('href'))
            ff.append(link.getText())
        flist.append(ff)
    return flist

def uploadFiles(dirPath):
    flist = getFileList()
    fnames = getFileNamesInDir(dirPath)
    if names in flist :
        deleteFromServer
        uploadAgain
        if not checkIfIsDone:
            doAgain # until Done
        mvThisFile2TmpDir
    pass

if __name__=="__main__":
    user='2013111004'
    pwd='lightning123'
    url='http://192.168.120.241:2014/index.aspx'
    res,session= login(url,user,pwd)
    print res,session
    print res.url
    flist = getFileList(res.text)
    fPath='./abc.doc'
    #_uploadFile(session,res.text,fPath,res.url)

