#!/usr/bin/env python
"""
    API request handler
"""
import traceback
import logging

from tornado import escape
from tornado.options import options
from tornado.web import RequestHandler as BaseRequestHandler, HTTPError
from exception import HTTPAPIError


class BaseHandler(BaseRequestHandler):

    def get(self, *args, **kwargs):
        # enable GET request when enable delegate get to post
        if options.app_get_to_post:
            self.post(*args, **kwargs)
        else:
            raise HTTPAPIError(405)

    def prepare(self):
        self.traffic_control()
        pass

    def traffic_control(self):
        # traffic control hooks for api call etc
        self.log_apicall()
        pass

    def log_apicall(self):
        pass


class RequestHandler(BaseHandler):
    pass

class APISecureHandler(BaseHandler):

    def get_current_user(self):
        #return self.get_secure_cookie("user")
        rem = self.get_secure_cookie("remb")
        user = self.get_secure_cookie("user")
        if rem=='0' or rem==None:
            return None
        elif rem=='1' :
            return user



class APIHandler(BaseHandler):

    def get_current_user(self):
        return self.get_secure_cookie("user")

        '''
        rem = self.get_secure_cookie("remb")
        user = self.get_secure_cookie("user")
        if rem=='0' or rem==None:
            return None
        elif rem=='1' :
            return user
       '''

    def finish(self, key=None,chunk=None, notification=None,success=True,total=0):
        if chunk is None:
            chunk = {}

        if isinstance(chunk, list):
            chunk = {"success": True, key: chunk,'total':total}
        elif isinstance(chunk,dict):
            chunk.update({"success":success})
            chunk.update({"total":total})
        elif chunk==None:
            chunk={"success":success,'total':total}

        if notification:
            chunk["notification"] = {"message": notification}

        callback = escape.utf8(self.get_argument("callback", None))
        if callback:
            self.set_header("Content-Type", "application/x-javascript")

            if isinstance(chunk, dict):
                chunk = escape.json_encode(chunk)

            self._write_buffer = [callback, "(", chunk, ")"] if chunk else []
            super(APIHandler, self).finish()
        else:
            self.set_header("Content-Type", "application/json; charset=UTF-8")
            if isinstance(chunk, dict):
                chunk = escape.json_encode(chunk)

            super(APIHandler, self).finish(chunk)

    def write_error(self, status_code, **kwargs):
        """Override to implement custom error pages."""
        debug = self.settings.get("debug", False)
        try:
            exc_info = kwargs.pop('exc_info')
            e = exc_info[1]

            if isinstance(e, HTTPAPIError):
                pass
            elif isinstance(e, HTTPError):
                e = HTTPAPIError(e.status_code)
            else:
                e = HTTPAPIError(500)

            exception = "".join(
                [ln for ln in traceback.format_exception(*exc_info)])

            if status_code == 500 and not debug:
                logging.error(exception)

            if debug:
                e.response["exception"] = exception

            self.clear()
            self.set_status(status_code)
            # self.set_status(200)  # always return 200 OK for API errors
            self.set_header("Content-Type", "application/json; charset=UTF-8")
            self.finish(str(e))
        except Exception:
            logging.error(traceback.format_exc())
            return super(APIHandler, self).write_error(status_code, **kwargs)


class ErrorHandler(RequestHandler):

    """Default 404: Not Found handler."""
    def prepare(self):
        super(ErrorHandler, self).prepare()
        raise HTTPError(404)


class APIErrorHandler(APIHandler):

    """Default API 404: Not Found handler."""
    def prepare(self):
        super(APIErrorHandler, self).prepare()
        raise HTTPAPIError(403)
