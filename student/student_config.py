#!/usr/bin/env python

redisMasterHosts={'host': '127.0.0.1', 'port': 6379, 'db': 0}

#RedisSlaveHosts= [{'host': '192.168.84.251', 'port': 6379, 'db': 0},]

ActivityNumLimit = 20

LogConfiguration = {
    "prefix": "/log/student/student.log",
    "when": "D" # "H" or "D" or "W" or "midnight"
}
