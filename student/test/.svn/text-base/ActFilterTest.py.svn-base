#!/usr/bin/env python
import sys
sys.path.append('..')
import feed

act_list = [
    {"act_type": 4, "uid": 18124920, "vid": "U_I6dTQ9vmrDmos81fFT_w..", "time": 1336266581},
    {"act_type": 16, "uid": 18124920, "vid": "U_I6dTQ9vmrDmos81fFT_w..", "time": 1336266804},
    {"act_type": 4, "uid": 18124920, "vid": "fgZh3rm7WgR8z2uwC-P1jA..", "time": 1338076251}
]

shield_list = [
    {"uid": 18124920, "time": 1338076251}
]

if __name__ == '__main__':

    print "test : mask=20, start=0, number=-1"
    list = feed._filter_activities(act_list, shield_list, 20, 0, -1)
    for act in list:
        print str(act)

    print ""
    print "test : mask=20, start=0, number=1"
    list = feed._filter_activities(act_list, shield_list, 20, 0, 1)
    for act in list:
        print str(act)

    print ""
    print "test : mask=20, start=1, number=1"
    list = feed._filter_activities(act_list, shield_list, 20, 1, 1)
    for act in list:
        print str(act)

    print ""
    print "test : mask=20, start=0, number=3"
    list = feed._filter_activities(act_list, shield_list, 20, 0, 3)
    for act in list:
        print str(act)

    print ""
    print "test : mask=20, start=2, number=1"
    list = feed._filter_activities(act_list, shield_list, 20, 2, 1)
    for act in list:
        print str(act)
