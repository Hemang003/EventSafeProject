import os
import requests

BASE_URL = os.getenv("BASE_URL", "http://localhost:8080")

def _get(path: str):
    """Helper that does a GET and returns the response.
    If the server is down or port is wrong, this will raise and the test will fail.
    """
    url = BASE_URL.rstrip("/") + path
    return requests.get(url, timeout=10)

def test_gateway_root_reachable():
    """Gateway should respond on the root URL."""
    res = _get("/")
    # We don't care if it's 200 or 404, only that it responds.
    assert 100 <= res.status_code < 600

def test_common_paths_do_not_crash():
    """Common paths should respond without connection errors."""
    paths = ["/health", "/api/events", "/events"]
    for path in paths:
        res = _get(path)
        # Again, we just assert that there IS an HTTP response.
        assert 100 <= res.status_code < 600
