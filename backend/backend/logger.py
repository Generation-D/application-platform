import logging
import os

import requests


class Logger:
    def __init__(self, module: str):
        # self.api_url = f"https://api.logflare.app/api/logs?source={os.environ['LOGFLARE_BACKEND_SOURCE_TOKEN']}"
        # self.api_get_url = f"https://api.logflare.app/api/endpoints/query/{os.environ['LOGFLARE_BACKEND_SOURCE_TOKEN']}"
        # self.HEADER = {'Content-Type': 'application/json', 'x-api-key': os.environ['LOGFLARE_BACKEND_API_TOKEN']}
        self.logger = logging.getLogger('ApiLogger')
        self.module = module

    def debug(self, message: str) -> None:
        return self.logger.debug(message)

    def info(self, message: str) -> bool:
        return self.__send_log_to_log_flare(message, "info")

    def warning(self, message: str) -> bool:
        return self.__send_log_to_log_flare(message, "warning")

    def error(self, message: str) -> bool:
        return self.__send_log_to_log_flare(message, "error")

    def fatal(self, message: str) -> bool:
        return self.__send_log_to_log_flare(message, "fatal")

    def __send_log_to_log_flare(self, message: str, level: int) -> bool:
        return
        payload = {
            "event_message": message,
            "metadata": {
                "level": level,
                "module": self.module,
            }
        }
        try:
            response = requests.post(self.api_url, headers=self.HEADER, json=payload, timeout=5.0)
            if response.status_code != 200:
                self.logger.error("Failed to send log to API. Status code: %s and Reason: %s", response.status_code,
                                  response.reason)
                assert False
        except requests.RequestException as e:
            self.logger.error("Failed to send log to API. Error: %s", str(e))
            return False
        return True
