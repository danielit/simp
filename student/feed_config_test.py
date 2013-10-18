#!/usr/bin/env python

RedisMasterHosts=[{'host':'58.215.140.240','port':6380,'db':0},
                  {'host':'58.215.140.240','port':6381,'db':0},
                  {'host':'58.215.140.240','port':6382,'db':0},
                  {'host':'58.215.140.240','port':6383,'db':0}]

RedisSlaveHosts= [{'host':'58.215.140.240','port':6380,'db':0},
                  {'host':'58.215.140.240','port':6381,'db':0},
                  {'host':'58.215.140.240','port':6382,'db':0},
                  {'host':'58.215.140.240','port':6383,'db':0}]

ActivityNumLimit = 20

LogConfiguration = {
    "prefix": "/log/api/feed.log",
#    "when"   : "D" # "H" or "D" or "W" or "midnight" 
}
