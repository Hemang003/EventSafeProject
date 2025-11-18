import requests

BASE_URL = "http://localhost:8080"


def _get(path: str):
    """Helper that does a GET request."""
    url = BASE_URL.rstrip("/") + path
    return requests.get(url, timeout=10)


def test_health_returns_200_or_204():
    """Health endpoint should return a success-ish status code."""
    res = _get("/health")
    # Many health endpoints use 200, some use 204 (no content)
    assert res.status_code in (200, 204)


def test_events_list_is_json_list():
    """GET /api/events should return a JSON list (possibly empty)."""
    res = _get("/api/events")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)


def test_get_single_event_by_id_if_exists():
    """
    If there is at least one event, we should be able to fetch it again
    via /api/events/<id> and get a JSON object.
    """
    res = _get("/api/events")
    assert res.status_code == 200
    events = res.json()
    assert isinstance(events, list)

    if not events:
        # No events yet – nothing more to assert, but the test still passes.
        return

    first = events[0]
    assert isinstance(first, dict)

    # Try to detect the event id field in a flexible way.
    event_id = first.get("id") or first.get("event_id") or first.get("eventId")
    assert event_id is not None, "Could not find an id/event_id/eventId field in event object"

    res_detail = _get(f"/api/events/{event_id}")
    # Most likely 200; if your API uses 302/304 or something else, you can adjust here.
    assert res_detail.status_code == 200
    detail = res_detail.json()
    assert isinstance(detail, dict)

