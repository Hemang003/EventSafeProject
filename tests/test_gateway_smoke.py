import requests

# Always talk to the gateway on port 8080
BASE_URL = "http://localhost:8080"

def _get(path: str):
    """Helper that does a GET and returns the response."""
    url = BASE_URL.rstrip("/") + path
    return requests.get(url, timeout=10)

def test_gateway_root_reachable():
    """Gateway should respond on the root URL (any status code is OK)."""
    res = _get("/")
    assert 100 <= res.status_code < 600

def test_common_paths_do_not_crash():
    """Common paths should give an HTTP response (not a connection error)."""
    paths = ["/health", "/api/events"]
    for path in paths:
        res = _get(path)
        assert 100 <= res.status_code < 600

